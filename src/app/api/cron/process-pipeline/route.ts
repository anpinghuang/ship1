import { NextResponse } from "next/server";
import { processPipeline } from "@/lib/pipeline";

export async function POST(req: Request) {
    // In a real app, this endpoint would be protected by a cron secret or
    // it would simply be an Inngest/QStash function handler.
    const authHeader = req.headers.get("authorization");

    // Simple basic protection for cron endpoints
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const result = await processPipeline();
        return NextResponse.json(result);
    } catch (error) {
        console.error("[CRON_PIPELINE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
