import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { generateDraftPost } from "@/lib/ai";

/**
 * POST: Generate a draft post for a specific commit.
 * Body: { commitSha: string }
 */
export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { commitSha } = await req.json();
        if (!commitSha) {
            return NextResponse.json({ error: "Missing commitSha" }, { status: 400 });
        }

        // Fetch the commit with its project
        const commit = await prisma.commit.findUnique({
            where: { sha: commitSha },
            include: { project: true }
        });

        if (!commit) {
            return NextResponse.json({ error: "Commit not found" }, { status: 404 });
        }

        // Verify user owns this project
        if (commit.project.userId !== userId) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Generate AI draft
        const repoName = commit.project.githubRepoName || "unknown-repo";
        const generated = await generateDraftPost(commit.message, repoName);

        // Save as draft linked to the commit
        const post = await prisma.post.create({
            data: {
                userId,
                projectId: commit.projectId,
                commitSha: commit.sha,
                content: generated.primary,
                variants: generated.variants,
                status: "DRAFT"
            },
            include: {
                project: { select: { githubRepoName: true } },
                commit: true
            }
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error: any) {
        console.error("[GENERATE_POST]", error);
        return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
    }
}
