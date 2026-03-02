import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const projectId = searchParams.get("projectId");

        const posts = await prisma.post.findMany({
            where: {
                userId,
                ...(status && status !== "ALL" ? { status: status as any } : {}),
                ...(projectId ? { projectId } : {})
            },
            include: {
                project: { select: { githubRepoName: true } },
                commit: true
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("[POSTS_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { postId, content, scheduledFor } = await req.json();
        if (!postId) return NextResponse.json({ error: "Missing postId" }, { status: 400 });

        const post = await prisma.post.findFirst({ where: { id: postId, userId } });
        if (!post) return new NextResponse("Not found", { status: 404 });

        const updated = await prisma.post.update({
            where: { id: postId },
            data: {
                ...(content !== undefined && { content }),
                ...(scheduledFor !== undefined && { scheduledFor: scheduledFor ? new Date(scheduledFor) : null })
            },
            include: { project: { select: { githubRepoName: true } } }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[POSTS_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { searchParams } = new URL(req.url);
        const postId = searchParams.get("postId");
        if (!postId) return NextResponse.json({ error: "Missing postId" }, { status: 400 });

        const post = await prisma.post.findFirst({ where: { id: postId, userId } });
        if (!post) return new NextResponse("Not found", { status: 404 });

        await prisma.post.delete({ where: { id: postId } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[POSTS_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
