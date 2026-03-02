import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { publishTweet } from "@/lib/twitter";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { postId, action } = body;

        if (!postId || !action) {
            return new NextResponse("Missing post ID or action", { status: 400 });
        }

        const post = await prisma.post.findUnique({
            where: { id: postId, userId }
        });

        if (!post) {
            return new NextResponse("Post not found", { status: 404 });
        }

        if (action === "SCHEDULE") {
            const updated = await prisma.post.update({
                where: { id: postId },
                data: { status: "SCHEDULED" }
            });
            return NextResponse.json({ success: true, post: updated, message: "Added to queue" });
        }

        if (action === "PUBLISH") {
            // Idempotency: don't publish if already published
            if (post.status === "PUBLISHED") {
                return NextResponse.json({
                    success: true,
                    post,
                    message: "Already published"
                });
            }

            // Publish to X via API v2
            const result = await publishTweet(userId, post.content, post.platformIds);

            if (!result.success) {
                console.error("[POST_ACTION] Publish failed:", result.error);

                // Mark as FAILED if it's not a rate limit issue
                if (!result.rateLimited) {
                    await prisma.post.update({
                        where: { id: postId },
                        data: { status: "FAILED" }
                    });
                }

                return NextResponse.json(
                    { success: false, error: result.error },
                    { status: result.rateLimited ? 429 : 500 }
                );
            }

            // Success — update post with tweet ID and mark as published
            const publishedNow = new Date();
            const nextFetch = new Date(publishedNow.getTime() + 2 * 60 * 60 * 1000); // +2h
            const updated = await prisma.post.update({
                where: { id: postId },
                data: {
                    status: "PUBLISHED",
                    publishedAt: publishedNow,
                    nextFetchAt: nextFetch,
                    platformIds: {
                        x: result.tweetId,
                        x_url: result.tweetUrl,
                        published_at: publishedNow.toISOString(),
                    }
                }
            });

            return NextResponse.json({
                success: true,
                post: updated,
                tweetUrl: result.tweetUrl,
                message: "Published to X!"
            });
        }

        return new NextResponse("Invalid action", { status: 400 });

    } catch (error) {
        console.error("[POST_ACTION_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
