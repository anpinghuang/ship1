import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const MAX_BATCH_SIZE = 100; // X API allows up to 100 tweet IDs per request
const MAX_RETRIES = 3;

/**
 * Polling schedule: hours after publish when we should fetch metrics.
 * After the last window, automatic polling stops.
 */
const POLL_SCHEDULE_HOURS = [2, 8, 24, 48, 72, 96, 120]; // 2h, 8h, 1d, 2d, 3d, 4d, 5d

/**
 * POST /api/metrics/poll
 *
 * Server-side worker that fetches impressions and replies from X API
 * for published posts. Must be called with: Authorization: Bearer WORKER_SECRET
 *
 * Designed to be triggered by an external scheduler (cron, Vercel cron, etc).
 */
export async function POST(req: Request) {
    // Auth check
    const secret = process.env.WORKER_SECRET;
    if (!secret) {
        console.error("[METRICS_POLL] WORKER_SECRET not configured");
        return new NextResponse("Server misconfigured", { status: 500 });
    }

    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${secret}`) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const startTime = Date.now();

    try {
        const now = new Date();

        // Select posts needing metrics update (not locked, nextFetchAt <= now)
        const postsToFetch = await prisma.post.findMany({
            where: {
                status: "PUBLISHED",
                nextFetchAt: { lte: now },
                fetchLocked: false,
                platformIds: { not: Prisma.DbNull }, // Must have a tweet ID
            },
            select: {
                id: true,
                userId: true,
                platformIds: true,
                publishedAt: true,
                fetchCount: true,
            },
            take: MAX_BATCH_SIZE,
        });

        if (postsToFetch.length === 0) {
            console.log("[METRICS_POLL] No posts need updating");
            return NextResponse.json({ processed: 0, durationMs: Date.now() - startTime });
        }

        console.log(`[METRICS_POLL] Processing ${postsToFetch.length} posts`);

        // Lock selected posts to prevent concurrent processing
        const postIds = postsToFetch.map(p => p.id);
        await prisma.post.updateMany({
            where: { id: { in: postIds } },
            data: { fetchLocked: true },
        });

        try {
            // Extract tweet IDs and map back to post IDs
            const tweetToPostMap = new Map<string, string>();
            for (const post of postsToFetch) {
                const platformIds = post.platformIds as any;
                const tweetId = platformIds?.x;
                if (tweetId && !String(tweetId).startsWith("mock_")) {
                    tweetToPostMap.set(String(tweetId), post.id);
                }
            }

            if (tweetToPostMap.size === 0) {
                console.log("[METRICS_POLL] No valid tweet IDs found");
                await unlockPosts(postIds);
                return NextResponse.json({ processed: 0, skipped: postIds.length, durationMs: Date.now() - startTime });
            }

            // Get a token from any connected X user (we need app-level or user-level token)
            // Use the first post's userId to get their token
            const firstPost = postsToFetch[0];
            const token = await getAnyXToken(firstPost.userId);

            if (!token) {
                console.error("[METRICS_POLL] No X token available");
                await unlockPosts(postIds);
                return NextResponse.json({ error: "No X token available", processed: 0 }, { status: 503 });
            }

            // Batch fetch metrics from X API
            const tweetIds = Array.from(tweetToPostMap.keys());
            const metrics = await fetchTweetMetrics(token, tweetIds);

            // Update each post with metrics
            let updated = 0;
            let errors = 0;

            for (const [tweetId, postId] of tweetToPostMap.entries()) {
                const tweetMetrics = metrics.get(tweetId);
                const post = postsToFetch.find(p => p.id === postId);
                if (!post) continue;

                const nextFetch = computeNextFetchAt(post.publishedAt, post.fetchCount + 1);

                try {
                    await prisma.post.update({
                        where: { id: postId },
                        data: {
                            impressions: tweetMetrics?.impression_count ?? 0,
                            replies: tweetMetrics?.reply_count ?? 0,
                            lastFetchedAt: now,
                            nextFetchAt: nextFetch, // null = stop polling
                            fetchCount: { increment: 1 },
                            fetchLocked: false,
                        },
                    });
                    updated++;
                } catch (e) {
                    console.error(`[METRICS_POLL] Failed to update post ${postId}:`, e);
                    errors++;
                }
            }

            // Unlock any remaining posts that didn't get processed
            await unlockPosts(postIds);

            const durationMs = Date.now() - startTime;
            console.log(`[METRICS_POLL] Done. Updated: ${updated}, Errors: ${errors}, Duration: ${durationMs}ms`);
            return NextResponse.json({ processed: updated, errors, durationMs });

        } catch (error) {
            // Always unlock on failure
            await unlockPosts(postIds);
            throw error;
        }

    } catch (error: any) {
        console.error("[METRICS_POLL_ERROR]", error);
        return NextResponse.json({ error: error?.message || "Internal error" }, { status: 500 });
    }
}

/* ═══════════════ Helpers ═══════════════ */

async function unlockPosts(postIds: string[]) {
    try {
        await prisma.post.updateMany({
            where: { id: { in: postIds } },
            data: { fetchLocked: false },
        });
    } catch (e) {
        console.error("[METRICS_POLL] Failed to unlock posts:", e);
    }
}

/**
 * Compute the next fetch time based on publish time and fetch count.
 * Returns null to stop polling (past day 5).
 */
function computeNextFetchAt(publishedAt: Date | null, fetchCount: number): Date | null {
    if (!publishedAt) return null;

    if (fetchCount >= POLL_SCHEDULE_HOURS.length) {
        return null; // Stop polling after day 5
    }

    const nextHours = POLL_SCHEDULE_HOURS[fetchCount];
    if (!nextHours) return null;

    const nextFetch = new Date(publishedAt.getTime() + nextHours * 60 * 60 * 1000);

    // If the computed next fetch is in the past (we're catching up), set it to now + 1 min
    if (nextFetch.getTime() <= Date.now()) {
        return new Date(Date.now() + 60_000);
    }

    return nextFetch;
}

/**
 * Get an X OAuth token from Clerk for any user.
 * Uses the Clerk Backend API.
 */
async function getAnyXToken(userId: string): Promise<string | null> {
    try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const client = await clerkClient();
        const providerData = await client.users.getUserOauthAccessToken(userId, "oauth_x");
        return providerData.data[0]?.token || null;
    } catch (error) {
        console.error("[METRICS_POLL] Failed to get X token:", error);
        return null;
    }
}

/**
 * Fetch public_metrics for a batch of tweet IDs from X API v2.
 * Returns a Map of tweetId -> { impression_count, reply_count }
 */
async function fetchTweetMetrics(
    token: string,
    tweetIds: string[]
): Promise<Map<string, { impression_count: number; reply_count: number }>> {
    const results = new Map<string, { impression_count: number; reply_count: number }>();

    // X API allows up to 100 IDs per request
    for (let i = 0; i < tweetIds.length; i += MAX_BATCH_SIZE) {
        const batch = tweetIds.slice(i, i + MAX_BATCH_SIZE);
        const idsParam = batch.join(",");

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                const res = await fetch(
                    `https://api.x.com/2/tweets?ids=${idsParam}&tweet.fields=public_metrics`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (res.status === 429) {
                    const resetTime = res.headers.get("x-rate-limit-reset");
                    const waitMs = resetTime
                        ? Math.max(parseInt(resetTime) * 1000 - Date.now(), 1000)
                        : 5000 * Math.pow(2, attempt);
                    console.warn(`[METRICS_POLL] Rate limited. Waiting ${Math.round(waitMs / 1000)}s`);
                    await new Promise(r => setTimeout(r, Math.min(waitMs, 30000)));
                    continue;
                }

                if (!res.ok) {
                    const body = await res.text();
                    console.error(`[METRICS_POLL] X API error ${res.status}:`, body);
                    break; // Don't retry non-rate-limit errors
                }

                const data = await res.json();
                if (data.data) {
                    for (const tweet of data.data) {
                        if (tweet.public_metrics) {
                            results.set(tweet.id, {
                                impression_count: tweet.public_metrics.impression_count ?? 0,
                                reply_count: tweet.public_metrics.reply_count ?? 0,
                            });
                        }
                    }
                }
                break; // Success, move to next batch

            } catch (error) {
                console.error(`[METRICS_POLL] Fetch error (attempt ${attempt + 1}):`, error);
                if (attempt < MAX_RETRIES - 1) {
                    await new Promise(r => setTimeout(r, 2000 * Math.pow(2, attempt)));
                }
            }
        }
    }

    return results;
}
