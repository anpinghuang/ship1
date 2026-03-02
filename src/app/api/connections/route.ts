import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/connections
 * Returns connection status from the database only — no provider API calls.
 * Instant response, cached client-side for 5 minutes.
 */
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        // Read all active connections from DB
        const connections = await prisma.providerConnection.findMany({
            where: { userId, revokedAt: null },
            select: {
                provider: true,
                username: true,
                connectedAt: true,
                lastValidatedAt: true,
            },
        });

        const githubConn = connections.find((c: any) => c.provider === "github");
        const xConn = connections.find((c: any) => c.provider === "x");

        // Get last published post timestamp
        let lastPublished: string | null = null;
        try {
            const lastPub = await prisma.post.findFirst({
                where: { userId, status: "PUBLISHED" },
                orderBy: { updatedAt: "desc" },
                select: { updatedAt: true },
            });
            if (lastPub) lastPublished = lastPub.updatedAt.toISOString();
        } catch {
            // Non-critical
        }

        return NextResponse.json({
            github: {
                connected: !!githubConn,
                username: githubConn?.username || null,
                connectedAt: githubConn?.connectedAt?.toISOString() || null,
            },
            twitter: {
                connected: !!xConn,
                username: xConn?.username || null,
                connectedAt: xConn?.connectedAt?.toISOString() || null,
            },
            lastPublished,
        });
    } catch (error: any) {
        console.error("[CONNECTIONS]", error);
        return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
    }
}
