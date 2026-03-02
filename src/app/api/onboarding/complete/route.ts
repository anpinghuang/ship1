import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const clerkUser = await currentUser();

        if (!userId || !clerkUser) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { repoId, repoName } = body;

        if (!repoId || !repoName) {
            return new NextResponse("Missing repoId or repoName", { status: 400 });
        }

        // Sync Clerk user -> Prisma database
        // Handle case where user exists from old auth system with different id
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const name = clerkUser.fullName || clerkUser.username;

        const existingByEmail = email ? await prisma.user.findUnique({ where: { email } }) : null;

        if (existingByEmail && existingByEmail.id !== userId) {
            // Old record exists with different id — update it to use Clerk id
            await prisma.user.update({
                where: { email },
                data: { id: userId, name }
            });
        } else {
            await prisma.user.upsert({
                where: { id: userId },
                update: { email, name },
                create: { id: userId, email, name }
            });
        }

        // Create or update Project with the selected GitHub repo
        const existingProject = await prisma.project.findFirst({
            where: { userId }
        });

        let project;
        if (existingProject) {
            project = await prisma.project.update({
                where: { id: existingProject.id },
                data: {
                    githubRepoId: repoId,
                    githubRepoName: repoName
                }
            });
        } else {
            project = await prisma.project.create({
                data: {
                    userId,
                    githubRepoId: repoId,
                    githubRepoName: repoName
                }
            });
        }

        return NextResponse.json({ success: true, project });

    } catch (error: any) {
        console.error("[ONBOARDING_POST]", error);
        return NextResponse.json(
            { error: error?.message || "Internal Error" },
            { status: 500 }
        );
    }
}
