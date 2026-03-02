import { prisma } from "./prisma";
import { generateDraftPost } from "./ai";
/**
 * Lightweight Background Queue Simulator for MVP.
 * In a real Next.js serverless app, we would use Inngest, Trigger.dev, or Upstash QStash.
 */

export async function processWebhookEvents() {
    console.log("Triggered background queue processor for ActivityEvents");

    // Fetch unprocessed events
    const events = await prisma.activityEvent.findMany({
        where: { processed: false },
        take: 10,
        include: { project: { include: { user: true } } }
    });

    for (const event of events) {
        try {
            // 1. Group commits from payload
            const payload = event.payload as any;
            const commits = payload.commits?.map((c: any) => c.message) || [];

            // 2. Pass to AI for drafting
            const generated = await generateDraftPost(
                commits.join('\n'),
                event.project.githubRepoName || "unknown-repo"
            );

            // 3. Save draft Post to DB
            await prisma.post.create({
                data: {
                    userId: event.project.userId,
                    content: generated.primary,
                    variants: generated.variants,
                    status: "DRAFT",
                }
            });

            // 4. Mark Processing Done
            await prisma.activityEvent.update({
                where: { id: event.id },
                data: { processed: true }
            });

        } catch (e) {
            console.error(`Failed to process event ${event.id}:`, e);
        }
    }
}

export async function processScheduledPosts() {
    // Simulated cron job that would check for scheduled posts and send to X
    const duePosts = await prisma.post.findMany({
        where: { status: "SCHEDULED", scheduledFor: { lte: new Date() } },
        include: { user: true }
    });

    for (const post of duePosts) {
        // Simulated: find X credentials
        // const twitterToken = post.user.accounts.find(a => a.provider === 'twitter');
        // const ti = new TwitterIntegration(twitterToken.access_token, twitterToken.refresh_token);
        // await ti.postMessage(post.content);

        await prisma.post.update({
            where: { id: post.id },
            data: { status: "PUBLISHED" }
        });
    }
}
