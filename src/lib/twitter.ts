import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/* ═══════════════ Types ═══════════════ */

interface TweetResponse {
    data: {
        id: string;
        text: string;
    };
}

export interface PublishResult {
    success: boolean;
    tweetId?: string;
    tweetUrl?: string;
    error?: string;
    rateLimited?: boolean;
}

/* ═══════════════ Constants ═══════════════ */

const X_API_BASE = "https://api.x.com/2";
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;
const TWEET_MAX_LENGTH = 280;

/* ═══════════════ Core API Call ═══════════════ */

async function xApiFetch(
    endpoint: string,
    token: string,
    options: RequestInit = {}
): Promise<Response> {
    return fetch(`${X_API_BASE}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });
}

/* ═══════════════ Token Retrieval ═══════════════ */

/**
 * Get the user's X OAuth access token from Clerk.
 * Clerk handles token storage and refresh automatically.
 */
export async function getXToken(userId: string): Promise<string | null> {
    try {
        const client = await clerkClient();
        const providerData = await client.users.getUserOauthAccessToken(userId, "oauth_x");
        const token = providerData.data[0]?.token;
        if (!token) {
            // Token missing — mark as revoked
            await markConnectionRevoked(userId, "x");
            return null;
        }
        return token;
    } catch (error) {
        console.error("[X_AUTH] Failed to retrieve X token for user:", userId, error);
        await markConnectionRevoked(userId, "x");
        return null;
    }
}

/** Mark a provider connection as revoked in the database */
async function markConnectionRevoked(userId: string, provider: string) {
    try {
        await prisma.providerConnection.update({
            where: { userId_provider: { userId, provider } },
            data: { revokedAt: new Date() },
        });
        console.log(`[X_AUTH] Marked ${provider} connection as revoked for user ${userId}`);
    } catch {
        // Record might not exist
    }
}

/* ═══════════════ Publish Single Tweet ═══════════════ */

/**
 * Publish a single tweet to X via API v2.
 * - Idempotent: skips if already published (checks platformIds)
 * - Retries with exponential backoff (3 attempts)
 * - Handles rate limits (429) by waiting for reset window
 * - Returns structured result with tweet ID/URL on success
 */
export async function publishTweet(
    userId: string,
    content: string,
    existingPlatformIds?: any
): Promise<PublishResult> {
    // Idempotency — skip if already published with a real tweet ID
    if (existingPlatformIds?.x && !String(existingPlatformIds.x).startsWith("mock_")) {
        console.log("[X_PUBLISH] Skipping — already published as:", existingPlatformIds.x);
        return {
            success: true,
            tweetId: existingPlatformIds.x,
            tweetUrl: `https://x.com/i/status/${existingPlatformIds.x}`,
        };
    }

    // Validate
    if (content.trim().length === 0) {
        return { success: false, error: "Tweet content is empty" };
    }
    if (content.length > TWEET_MAX_LENGTH) {
        return { success: false, error: `Tweet exceeds ${TWEET_MAX_LENGTH} characters (${content.length})` };
    }

    // Get token from Clerk
    const token = await getXToken(userId);
    if (!token) {
        return { success: false, error: "X account not connected. Please connect your X account in Settings." };
    }

    // Retry loop
    let lastError = "Unknown error";

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        if (attempt > 0) {
            const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
            console.log(`[X_PUBLISH] Retry ${attempt}/${MAX_RETRIES}, waiting ${backoff}ms...`);
            await new Promise((r) => setTimeout(r, backoff));
        }

        try {
            console.log(`[X_PUBLISH] Attempt ${attempt + 1}/${MAX_RETRIES} for user ${userId}`);

            const res = await xApiFetch("/tweets", token, {
                method: "POST",
                body: JSON.stringify({ text: content }),
            });

            // Log rate limit info
            const remaining = res.headers.get("x-rate-limit-remaining");
            if (remaining) console.log(`[X_PUBLISH] Rate limit remaining: ${remaining}`);

            // Rate limited — wait for reset
            if (res.status === 429) {
                const resetTime = res.headers.get("x-rate-limit-reset");
                const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : null;
                const waitMs = resetDate
                    ? Math.max(resetDate.getTime() - Date.now(), INITIAL_BACKOFF_MS)
                    : INITIAL_BACKOFF_MS * Math.pow(2, attempt);

                console.warn(`[X_PUBLISH] Rate limited. Reset at: ${resetDate?.toISOString()}`);

                if (attempt < MAX_RETRIES - 1) {
                    await new Promise((r) => setTimeout(r, Math.min(waitMs, 30000)));
                    continue;
                }
                return { success: false, error: "X API rate limit reached. Please try again later.", rateLimited: true };
            }

            // Auth failure — don't retry, mark connection as revoked
            if (res.status === 401 || res.status === 403) {
                const body = await res.json().catch(() => ({}));
                console.error("[X_PUBLISH] Auth error:", body);
                await markConnectionRevoked(userId, "x");
                return { success: false, error: "X authentication failed. Please reconnect your X account in Settings." };
            }

            // Other errors — retry
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                lastError = (body as any)?.detail || (body as any)?.title || `HTTP ${res.status}`;
                console.error(`[X_PUBLISH] API error (${res.status}):`, body);
                continue;
            }

            // Success
            const data: TweetResponse = await res.json();
            console.log(`[X_PUBLISH] ✓ Tweet ID: ${data.data.id}`);
            return {
                success: true,
                tweetId: data.data.id,
                tweetUrl: `https://x.com/i/status/${data.data.id}`,
            };
        } catch (error: any) {
            lastError = error.message || "Network error";
            console.error(`[X_PUBLISH] Network error attempt ${attempt + 1}:`, error.message);
        }
    }

    return { success: false, error: `Failed after ${MAX_RETRIES} attempts: ${lastError}` };
}

/* ═══════════════ Publish Thread ═══════════════ */

/**
 * Publish a thread — multiple tweets posted as replies to each other.
 */
export async function publishThread(
    userId: string,
    tweets: string[]
): Promise<PublishResult> {
    if (tweets.length === 0) return { success: false, error: "Thread is empty" };
    if (tweets.length === 1) return publishTweet(userId, tweets[0]);

    const token = await getXToken(userId);
    if (!token) {
        return { success: false, error: "X account not connected. Please connect your X account in Settings." };
    }

    let previousTweetId: string | null = null;
    let firstTweetId: string | null = null;

    for (let i = 0; i < tweets.length; i++) {
        if (tweets[i].length > TWEET_MAX_LENGTH) {
            return { success: false, error: `Tweet ${i + 1} exceeds ${TWEET_MAX_LENGTH} characters` };
        }

        const body: any = { text: tweets[i] };
        if (previousTweetId) body.reply = { in_reply_to_tweet_id: previousTweetId };

        let posted = false;
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            if (attempt > 0) await new Promise((r) => setTimeout(r, INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1)));

            try {
                const res = await xApiFetch("/tweets", token, { method: "POST", body: JSON.stringify(body) });

                if (res.status === 429) {
                    const resetTime = res.headers.get("x-rate-limit-reset");
                    const waitMs = resetTime
                        ? Math.max(parseInt(resetTime) * 1000 - Date.now(), INITIAL_BACKOFF_MS)
                        : INITIAL_BACKOFF_MS * Math.pow(2, attempt);
                    await new Promise((r) => setTimeout(r, Math.min(waitMs, 30000)));
                    continue;
                }

                if (!res.ok) {
                    if (attempt >= MAX_RETRIES - 1) {
                        const errBody = await res.json().catch(() => ({}));
                        return { success: false, tweetId: firstTweetId || undefined, error: `Thread failed on tweet ${i + 1}: ${(errBody as any)?.detail || `HTTP ${res.status}`}` };
                    }
                    continue;
                }

                const data: TweetResponse = await res.json();
                previousTweetId = data.data.id;
                if (i === 0) firstTweetId = data.data.id;
                posted = true;
                console.log(`[X_THREAD] Tweet ${i + 1}/${tweets.length}: ${data.data.id}`);
                break;
            } catch (error: any) {
                if (attempt >= MAX_RETRIES - 1) {
                    return { success: false, tweetId: firstTweetId || undefined, error: `Thread failed on tweet ${i + 1}: ${error.message}` };
                }
            }
        }

        if (!posted) return { success: false, tweetId: firstTweetId || undefined, error: `Failed to post tweet ${i + 1}` };

        // Small delay between thread tweets
        if (i < tweets.length - 1) await new Promise((r) => setTimeout(r, 500));
    }

    return { success: true, tweetId: firstTweetId!, tweetUrl: `https://x.com/i/status/${firstTweetId}` };
}
