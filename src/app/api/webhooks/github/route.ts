import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const payload = await req.text();
        const signature = req.headers.get("x-hub-signature-256");
        const eventType = req.headers.get("x-github-event") || "unknown";

        // In a real app we'd get the webhook secret from the DB for this specific project or a global env var.
        // For MVP, we use a single global secret if provided, otherwise bypass for local testing.
        const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

        if (webhookSecret && signature) {
            const hmac = crypto.createHmac("sha256", webhookSecret);
            const digest = "sha256=" + hmac.update(payload).digest("hex");
            if (signature !== digest) {
                return new NextResponse("Invalid signature", { status: 401 });
            }
        } else if (process.env.NODE_ENV === "production" && !webhookSecret) {
            // Require signatures in production
            return new NextResponse("Missing signature or secret", { status: 401 });
        }

        const data = JSON.parse(payload);

        // Find corresponding project by repo ID
        const repoId = data.repository?.id?.toString();

        if (!repoId) {
            return new NextResponse("No repository ID found in payload", { status: 400 });
        }

        const project = await prisma.project.findFirst({
            where: { githubRepoId: repoId }
        });

        if (!project) {
            console.log(`[WEBHOOK] Ignored event for untracked repo ID: ${repoId}`);
            return new NextResponse("OK", { status: 200 }); // Return 200 to GitHub so it doesn't fail
        }

        // 1. Store the raw event
        const event = await prisma.activityEvent.create({
            data: {
                projectId: project.id,
                eventType: eventType,
                payload: data,
                processed: false
            }
        });

        console.log(`[WEBHOOK] Recorded ${eventType} for project ${project.id}`);

        // 2. If it's a push event, extract and save individual commits
        if (eventType === "push" && data.commits && Array.isArray(data.commits)) {
            let savedCommits = 0;

            for (const commitData of data.commits) {
                // Skip merge commits or empty messages
                if (!commitData.message || commitData.message.startsWith("Merge pull request") || commitData.message.startsWith("Merge branch")) {
                    continue;
                }

                try {
                    await prisma.commit.upsert({
                        where: { sha: commitData.id },
                        create: {
                            sha: commitData.id,
                            projectId: project.id,
                            message: commitData.message,
                            author: commitData.author?.name || commitData.author?.username || "Unknown",
                            url: commitData.url,
                            committedAt: commitData.timestamp ? new Date(commitData.timestamp) : new Date(),
                        },
                        update: {} // No-op if already exists
                    });
                    savedCommits++;
                } catch (e) {
                    console.error(`[WEBHOOK] Error saving commit ${commitData.id}:`, e);
                }
            }

            console.log(`[WEBHOOK] Saved ${savedCommits} commits for project ${project.id}. AutoDrafts: ${project.autoDrafts}`);

            // 3. Mark event as processed since we extracted the commits
            await prisma.activityEvent.update({
                where: { id: event.id },
                data: { processed: true }
            });

            // 4. (Coming later) Background job for autoDrafts
            // if (project.autoDrafts && savedCommits > 0) { ... trigger ai job ... }
        }

        return new NextResponse("Accepted", { status: 202 });

    } catch (error) {
        console.error("[WEBHOOK_POST_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
