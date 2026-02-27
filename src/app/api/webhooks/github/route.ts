import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    const payload = await req.json();
    const signature = req.headers.get("x-hub-signature-256");

    // Verify signature (Simplified for MVP, should be more robust in production)
    if (WEBHOOK_SECRET) {
        const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
        const digest = Buffer.from(
            "sha256=" + hmac.update(JSON.stringify(payload)).digest("hex"),
            "utf8"
        );
        const checksum = Buffer.from(signature || "", "utf8");
        if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
    }

    const eventType = req.headers.get("x-github-event");

    // Log activity
    console.log(`Received GitHub event: ${eventType}`);

    // Find associated project
    const repoId = payload.repository?.id.toString();
    const project = await prisma.project.findUnique({
        where: { githubRepoId: repoId },
    });

    if (!project) {
        return NextResponse.json({ message: "Repository not tracked" }, { status: 200 });
    }

    // Handle Push events (Commits)
    if (eventType === "push") {
        const commits = payload.commits || [];
        for (const commit of commits) {
            // Save ActivityEvent to DB
            await prisma.activityEvent.create({
                data: {
                    type: "COMMIT",
                    payload: commit,
                    projectId: project.id,
                }
            });
        }

        // In a real app, we would trigger a background job here
        // e.g. triggerAIProcess(project.id)
    }

    return NextResponse.json({ success: true });
}
