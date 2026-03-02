import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";

/**
 * POST /api/connections/sync
 * Called after an OAuth redirect returns to the Settings page.
 * Reads the fresh token from Clerk, fetches provider profile info,
 * encrypts tokens, and upserts a ProviderConnection row.
 */
export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { provider } = body; // "github" | "x"

        if (!provider || !["github", "x"].includes(provider)) {
            return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
        }

        const client = await clerkClient();
        const oauthProvider = provider === "github" ? "oauth_github" : "oauth_x";

        // Get the fresh token from Clerk
        let token: string | null = null;
        try {
            const providerData = await client.users.getUserOauthAccessToken(userId, oauthProvider);
            token = providerData.data[0]?.token || null;
        } catch (error) {
            console.error(`[SYNC] Failed to get ${provider} token:`, error);
            return NextResponse.json({ error: `Failed to get ${provider} token from Clerk` }, { status: 400 });
        }

        if (!token) {
            return NextResponse.json({ error: `No ${provider} token available` }, { status: 400 });
        }

        // Fetch provider profile
        let providerAccountId = "";
        let username: string | null = null;
        let scope: string | null = null;

        if (provider === "github") {
            try {
                const res = await fetch("https://api.github.com/user", {
                    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
                });
                if (res.ok) {
                    const data = await res.json();
                    providerAccountId = String(data.id);
                    username = data.login;
                }
            } catch (e) {
                console.error("[SYNC] GitHub profile fetch failed:", e);
            }
        } else if (provider === "x") {
            try {
                const res = await fetch("https://api.x.com/2/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    providerAccountId = data.data?.id || "";
                    username = data.data?.username || null;
                }
            } catch (e) {
                console.error("[SYNC] X profile fetch failed:", e);
            }
        }

        if (!providerAccountId) {
            providerAccountId = `${provider}_${userId}`;
        }

        // Encrypt tokens
        const accessTokenEnc = encrypt(token);

        // Upsert the connection
        const connection = await prisma.providerConnection.upsert({
            where: { userId_provider: { userId, provider } },
            create: {
                userId,
                provider,
                providerAccountId,
                username,
                scope,
                accessTokenEnc,
                connectedAt: new Date(),
                lastValidatedAt: new Date(),
                revokedAt: null,
            },
            update: {
                providerAccountId,
                username,
                scope,
                accessTokenEnc,
                connectedAt: new Date(),
                lastValidatedAt: new Date(),
                revokedAt: null, // Clear revocation on re-connect
            },
        });

        console.log(`[SYNC] ${provider} connection synced for user ${userId} (${username})`);
        return NextResponse.json({ success: true, provider, username });
    } catch (error: any) {
        console.error("[SYNC_ERROR]", error);
        return NextResponse.json({ error: error?.message || "Internal error" }, { status: 500 });
    }
}
