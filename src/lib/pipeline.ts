import { prisma } from "@/lib/prisma";

export async function processPipeline() {
    try {
        console.log("[AI_PIPELINE] Starting mock AI generation pipeline...");

        // 1. Fetch unprocessed activity events
        const events = await prisma.activityEvent.findMany({
            where: { processed: false },
            include: { project: true },
            take: 10 // Batch processing
        });

        if (events.length === 0) {
            console.log("[AI_PIPELINE] No unprocessed events found.");
            return { processed: 0, generated: 0 };
        }

        let generatedCount = 0;

        for (const event of events) {
            const project = event.project;
            const payload = event.payload as any;

            // 2. Simple logic: Only process push events with commits
            if (event.eventType === "push" && payload.commits && payload.commits.length > 0) {
                const commits = payload.commits;
                const commitMessages = commits.map((c: any) => c.message).join(" | ");

                // TODO: Here is where we would call OpenAI:
                // const response = await openai.createChatCompletion({ ... })

                // --- MOCK GENERATION ---
                const mockGeneratedText = `I just pushed some updates to ${project.githubRepoName}! 🚀\n\nLatest changes:\n- ${commits[0].message}\n\nBuilding in public is wild. What are you shipping today? #buildinpublic`;

                const mockVariants = [
                    mockGeneratedText,
                    `Ship update: Working hard on ${project.githubRepoName}. Just dropped a commit for: ${commits[0].message}. Step by step! 🛠️`,
                    `Technical update on ${project.githubRepoName}:\n\nAdded: ${commits[0].message}\n\nThe grind continues. `
                ];

                // 3. Save as Draft Post
                await prisma.post.create({
                    data: {
                        userId: project.userId,
                        content: mockVariants[0],
                        variants: mockVariants,
                        status: "DRAFT"
                    }
                });

                generatedCount++;
                console.log(`[AI_PIPELINE] Generated draft post for Project ${project.id}`);
            }

            // Mark event as processed regardless so we don't loop it
            await prisma.activityEvent.update({
                where: { id: event.id },
                data: { processed: true }
            });
        }

        return { processed: events.length, generated: generatedCount };

    } catch (error) {
        console.error("[AI_PIPELINE_ERROR]", error);
        throw error;
    }
}
