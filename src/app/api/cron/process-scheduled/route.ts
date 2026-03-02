import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publishTweet } from "@/lib/twitter";

export async function POST(req: Request) {
    // Protect with CRON_SECRET
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        console.log("[CRON_SCHEDULER] Starting scheduled posts worker...");

        // Fetch scheduled posts (batch of 5)
        const scheduledPosts = await prisma.post.findMany({
            where: { status: "SCHEDULED" },
            take: 5
        });

        if (scheduledPosts.length === 0) {
            console.log("[CRON_SCHEDULER] No scheduled posts found.");
            return NextResponse.json({ processed: 0 });
        }

        let publishedCount = 0;
        let failedCount = 0;

        for (const post of scheduledPosts) {
            console.log(`[CRON_SCHEDULER] Publishing post ${post.id} for user ${post.userId}`);

            const result = await publishTweet(post.userId, post.content, post.platformIds);

            if (result.success) {
                await prisma.post.update({
                    where: { id: post.id },
                    data: {
                        status: "PUBLISHED",
                        platformIds: {
                            x: result.tweetId,
                            x_url: result.tweetUrl,
                            published_at: new Date().toISOString(),
                        }
                    }
                });
                publishedCount++;
                console.log(`[CRON_SCHEDULER] ✓ Post ${post.id} published as tweet ${result.tweetId}`);
            } else {
                // Mark as FAILED unless rate limited (keep scheduled for retry)
                if (!result.rateLimited) {
                    await prisma.post.update({
                        where: { id: post.id },
                        data: { status: "FAILED" }
                    });
                }
                failedCount++;
                console.error(`[CRON_SCHEDULER] ✗ Post ${post.id} failed: ${result.error}`);
            }

            // Small delay between posts to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log(`[CRON_SCHEDULER] Done. Published: ${publishedCount}, Failed: ${failedCount}`);
        return NextResponse.json({ processed: publishedCount, failed: failedCount });

    } catch (error) {
        console.error("[CRON_SCHEDULER_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
