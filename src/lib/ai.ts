import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

/**
 * Strip markdown formatting and preamble from Gemini output.
 * Removes things like "**Best Option:**", "Here are 3 variations:", numbered prefixes, etc.
 */
function cleanTweet(text: string): string {
    let cleaned = text
        .replace(/\*\*[^*]+\*\*/g, "")        // remove **bold labels**
        .replace(/^#+\s+.*/gm, "")            // remove markdown headers
        .replace(/^\d+\.\s*/gm, "")           // remove numbered list prefixes
        .replace(/^[-*]\s*/gm, "")            // remove bullet points
        .replace(/^here\s+(are|is)\s+.*/gim, "") // remove "Here are 3 variations" preambles
        .replace(/^(option|variation|tweet)\s*\d*\s*:?\s*/gim, "") // remove "Option 1:" labels
        .replace(/^(best|first|second|third)\s*(option|variation|tweet)\s*:?\s*/gim, "")
        .trim();
    // Remove any leading/trailing blank lines
    cleaned = cleaned.replace(/^\s*\n+/g, "").replace(/\n+\s*$/g, "");
    return cleaned;
}

/**
 * Generate a #BuildInPublic tweet from a commit message using Gemini AI.
 * Falls back to a template if no API key is configured.
 */
export async function generateDraftPost(
    commitMessage: string,
    repoName: string
): Promise<{ primary: string; variants: string[] }> {
    // Fallback if no Gemini key
    if (!genAI) {
        return {
            primary: `Just shipped an update to ${repoName}:\n\n✨ ${commitMessage.split("\n")[0]}\n\nBuilding in public, one commit at a time! 🚀 #buildinpublic`,
            variants: [
                `Code update on ${repoName}: ${commitMessage.split("\n")[0]}. The grind continues 🔥 #buildinpublic`,
                `Another step forward for ${repoName}!\n\n${commitMessage.split("\n")[0]}\n\nWhat are you shipping today? 👇 #buildinpublic`
            ]
        };
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Write 3 short tweets (under 260 chars each) for a developer posting about this commit on X. Each tweet should sound authentic and casual. End each with #buildinpublic. Include 1-2 emojis each.

Repo: ${repoName}
Commit: ${commitMessage.split("\n")[0]}

CRITICAL: Output ONLY the 3 tweets, separated by exactly "---" on its own line. No labels, no numbering, no headers, no markdown, no preamble. Just the raw tweet text.`;

        const result = await model.generateContent(prompt);
        const rawText = result.response.text().trim();
        console.log("[GEMINI_RAW_RESPONSE]", rawText);

        const parts = rawText
            .split("---")
            .map(p => cleanTweet(p))
            .filter(p => p.length > 10 && p.length < 300);

        console.log("[GEMINI_PARSED]", JSON.stringify(parts, null, 2));

        return {
            primary: parts[0] || `Pushed to ${repoName}: ${commitMessage.split("\n")[0]} 🚀 #buildinpublic`,
            variants: parts.slice(1)
        };
    } catch (error) {
        console.error("[GEMINI_ERROR]", error);
        return {
            primary: `Just shipped an update to ${repoName}:\n\n✨ ${commitMessage.split("\n")[0]}\n\n🚀 #buildinpublic`,
            variants: []
        };
    }
}
