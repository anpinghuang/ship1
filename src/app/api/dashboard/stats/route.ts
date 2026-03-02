import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        // Date ranges
        const now = new Date();
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [
            drafts,
            publishedTotal,
            publishedThisWeek,
            projects,
            recentCommits,
            publishedPosts,
            metricsAgg,
        ] = await Promise.all([
            prisma.post.count({ where: { userId, status: "DRAFT" } }),
            prisma.post.count({ where: { userId, status: "PUBLISHED" } }),
            prisma.post.count({ where: { userId, status: "PUBLISHED", updatedAt: { gte: weekAgo } } }),
            prisma.project.findMany({ where: { userId }, select: { id: true, githubRepoName: true } }),
            // Recent commits with their post status
            prisma.commit.findMany({
                where: { project: { userId } },
                orderBy: { committedAt: "desc" },
                take: 15,
                include: {
                    project: { select: { id: true, githubRepoName: true } },
                    posts: { select: { id: true, status: true, content: true } },
                },
            }),
            // For streak calculation
            prisma.post.findMany({
                where: { userId, status: "PUBLISHED", createdAt: { gte: thirtyDaysAgo } },
                select: { createdAt: true },
                orderBy: { createdAt: "desc" },
            }),
            // Aggregate impressions and replies from published posts
            prisma.post.aggregate({
                where: { userId, status: "PUBLISHED" },
                _sum: { impressions: true, replies: true },
            }),
        ]);

        // Calculate streak
        let streak = 0;
        if (publishedPosts.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const uniqueDays = new Set(
                publishedPosts.map((p: any) => {
                    const d = new Date(p.createdAt);
                    d.setHours(0, 0, 0, 0);
                    return d.getTime();
                })
            );
            const sortedDays = (Array.from(uniqueDays) as number[]).sort((a, b) => b - a);
            for (let i = 0; i < sortedDays.length; i++) {
                const expected = new Date(today);
                expected.setDate(expected.getDate() - i);
                expected.setHours(0, 0, 0, 0);
                if (sortedDays[i] === expected.getTime()) {
                    streak++;
                } else break;
            }
        }

        // Map commits
        const commits = recentCommits.map((c: any) => {
            const post = c.posts[0];
            let status: "undrafted" | "drafted" | "published" = "undrafted";
            if (post?.status === "PUBLISHED") status = "published";
            else if (post) status = "drafted";

            return {
                sha: c.sha,
                message: c.message,
                author: c.author,
                url: c.url,
                committedAt: c.committedAt,
                repo: c.project.githubRepoName || "Unknown",
                projectId: c.project.id,
                status,
                postId: post?.id || null,
                postContent: post?.content?.slice(0, 120) || null,
            };
        });

        return NextResponse.json({
            drafts,
            publishedTotal,
            publishedThisWeek,
            totalImpressions: metricsAgg._sum.impressions ?? 0,
            totalReplies: metricsAgg._sum.replies ?? 0,
            streak,
            projects,
            commits,
        });
    } catch (error: any) {
        console.error("[DASHBOARD_STATS]", error);
        return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
    }
}
