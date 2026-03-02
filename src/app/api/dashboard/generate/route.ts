import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * POST: Fetch recent commits from GitHub for user's tracked repos,
 * store them in the Commit table (deduplicate by SHA), return the list.
 */
export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json().catch(() => ({}));
        const { projectId, backfill } = body;

        // Get user's tracked projects
        const projects = await prisma.project.findMany({
            where: {
                userId,
                tracking: true,
                ...(projectId ? { id: projectId } : {})
            }
        });

        if (projects.length === 0) {
            return NextResponse.json({ commits: [] });
        }

        // Get GitHub access token
        let accessToken: string | undefined;
        try {
            const client = await clerkClient();
            const providerData = await client.users.getUserOauthAccessToken(userId, "oauth_github");
            accessToken = providerData.data[0]?.token;
        } catch (error) {
            console.error("[FETCH_COMMITS] GitHub OAuth token error:", error);
        }

        if (!accessToken) {
            return NextResponse.json({ error: "GitHub not connected" }, { status: 400 });
        }

        // Calculate time windows
        const now = new Date();
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(now.getDate() - 14);

        const fortyFourDaysAgo = new Date();
        fortyFourDaysAgo.setDate(now.getDate() - 44);

        let sinceParam = "";
        let untilParam = "";
        let perPage = 100;

        if (backfill) {
            // Import historical window (14 to 44 days ago), limit to 30
            sinceParam = `&since=${fortyFourDaysAgo.toISOString()}`;
            untilParam = `&until=${fourteenDaysAgo.toISOString()}`;
            perPage = 30;
        } else {
            // Default window (last 14 days)
            sinceParam = `&since=${fourteenDaysAgo.toISOString()}`;
        }

        const allCommits: any[] = [];

        for (const project of projects) {
            if (!project.githubRepoName) continue;

            const res = await fetch(
                `https://api.github.com/repos/${project.githubRepoName}/commits?per_page=${perPage}${sinceParam}${untilParam}`,
                {
                    headers: {
                        Accept: "application/vnd.github.v3+json",
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            if (!res.ok) {
                const errText = await res.text();
                console.error(`[FETCH_COMMITS] GitHub API Error for ${project.githubRepoName}: Status ${res.status} -`, errText);
                continue;
            }

            const ghCommits = await res.json();

            for (const c of ghCommits) {
                // Upsert commit to dedup by SHA
                const commit = await prisma.commit.upsert({
                    where: { sha: c.sha },
                    update: {},
                    create: {
                        sha: c.sha,
                        projectId: project.id,
                        message: c.commit?.message || "",
                        author: c.commit?.author?.name || c.author?.login || null,
                        url: c.html_url,
                        committedAt: new Date(c.commit?.author?.date || new Date())
                    }
                });

                // Check if this commit has any posts
                const postCount = await prisma.post.count({
                    where: { commitSha: c.sha }
                });

                allCommits.push({
                    ...commit,
                    repo: project.githubRepoName,
                    projectId: project.id,
                    hasPost: postCount > 0,
                    postCount
                });
            }
        }

        // Sort newest first
        allCommits.sort((a, b) => new Date(b.committedAt).getTime() - new Date(a.committedAt).getTime());

        return NextResponse.json({ commits: allCommits });
    } catch (error: any) {
        console.error("[FETCH_COMMITS]", error);
        return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
    }
}
