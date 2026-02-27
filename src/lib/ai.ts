// src/lib/ai.ts
// In a real implementation, this would call OpenAI/Anthropic API

export interface ActivityDetail {
    id: string;
    message: string;
    repo: string;
}

export async function generateSocialPosts(activity: ActivityDetail, tone: string = "Technical") {
    console.log(`Generating posts for ${activity.repo} with tone ${tone}...`);

    // Simulated AI response
    const baseContent = activity.message;

    return [
        `Just pushed an update to ${activity.repo}: ${baseContent} 🚀 #buildinpublic`,
        `Shipping fast! 🚢 ${activity.repo} just got a new feature: ${baseContent}. What do you think?`,
        `Dev log: ${baseContent} is now live in ${activity.repo}. The engine is getting faster every day. 💪`,
    ];
}
