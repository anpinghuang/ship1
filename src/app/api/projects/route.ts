import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET: list user's projects with stats
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const projects = await prisma.project.findMany({
            where: { userId },
            include: {
                _count: {
                    select: { events: true, posts: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(projects);
    } catch (error: any) {
        console.error("[PROJECTS_GET]", error);
        return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
    }
}

// POST: add a new repo
export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const clerkUser = await currentUser();
        if (!userId || !clerkUser) return new NextResponse("Unauthorized", { status: 401 });

        const { githubRepoId, githubRepoName } = await req.json();
        if (!githubRepoId || !githubRepoName) {
            return NextResponse.json({ error: "Missing repoId or repoName" }, { status: 400 });
        }

        // Check if already tracked
        const existing = await prisma.project.findFirst({
            where: { userId, githubRepoId: githubRepoId }
        });
        if (existing) {
            return NextResponse.json({ error: "Repository already tracked" }, { status: 409 });
        }

        // Ensure user exists in DB
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const name = clerkUser.fullName || clerkUser.username;
        const existingByEmail = email ? await prisma.user.findUnique({ where: { email } }) : null;

        if (existingByEmail && existingByEmail.id !== userId) {
            await prisma.user.update({ where: { email }, data: { id: userId, name } });
        } else {
            await prisma.user.upsert({
                where: { id: userId },
                update: { email, name },
                create: { id: userId, email, name }
            });
        }

        const project = await prisma.project.create({
            data: { userId, githubRepoId, githubRepoName }
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error: any) {
        console.error("[PROJECTS_POST]", error);
        return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
    }
}

// PATCH: update project settings (tracking, cadence, autoApprove)
export async function PATCH(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { projectId, tracking, cadence, autoApprove } = await req.json();
        if (!projectId) {
            return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
        }

        const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
        if (!project) return new NextResponse("Not found", { status: 404 });

        const updated = await prisma.project.update({
            where: { id: projectId },
            data: {
                ...(tracking !== undefined && { tracking }),
                ...(cadence !== undefined && { cadence }),
                ...(autoApprove !== undefined && { autoApprove })
            }
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        console.error("[PROJECTS_PATCH]", error);
        return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
    }
}

// DELETE: remove a project
export async function DELETE(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { searchParams } = new URL(req.url);
        const projectId = searchParams.get("projectId");
        if (!projectId) {
            return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
        }

        const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
        if (!project) return new NextResponse("Not found", { status: 404 });

        await prisma.project.delete({ where: { id: projectId } });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[PROJECTS_DELETE]", error);
        return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
    }
}
