import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/connections/disconnect
 * Soft-deletes a connection by setting revokedAt.
 * Also destroys the Clerk external account.
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

        // Mark as revoked in DB
        try {
            await prisma.providerConnection.update({
                where: { userId_provider: { userId, provider } },
                data: { revokedAt: new Date() },
            });
        } catch (e) {
            // Record might not exist — that's ok
            console.log(`[DISCONNECT] No DB record for ${provider}, skipping`);
        }

        // Also destroy in Clerk
        try {
            const client = await clerkClient();
            const user = await client.users.getUser(userId);
            const providerName = provider === "github" ? "github" : "x";
            const externalAccount = user.externalAccounts?.find(
                (ea: any) => ea.provider === providerName
            );
            if (externalAccount) {
                // Use Clerk Backend API to delete the external account
                await client.users.deleteUserExternalAccount({ userId, externalAccountId: externalAccount.id });
            }
        } catch (e) {
            console.error(`[DISCONNECT] Failed to remove Clerk external account:`, e);
            // Non-critical — DB record is already revoked
        }

        console.log(`[DISCONNECT] ${provider} disconnected for user ${userId}`);
        return NextResponse.json({ success: true, provider });
    } catch (error: any) {
        console.error("[DISCONNECT_ERROR]", error);
        return NextResponse.json({ error: error?.message || "Internal error" }, { status: 500 });
    }
}
