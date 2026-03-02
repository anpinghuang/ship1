import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if user has GitHub connected via Clerk
        let hasGithub = false;
        try {
            const client = await clerkClient();
            const providerData = await client.users.getUserOauthAccessToken(userId, "oauth_github");
            hasGithub = !!providerData.data[0]?.token;
        } catch {
            hasGithub = false;
        }

        // Check if user has a project with a repo configured
        let hasRepo = false;
        if (hasGithub) {
            const project = await prisma.project.findFirst({
                where: {
                    userId,
                    githubRepoName: { not: null }
                }
            });
            hasRepo = !!project;
        }

        return NextResponse.json({ hasGithub, hasRepo });
    } catch (error) {
        console.error("[ONBOARDING_STATUS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
