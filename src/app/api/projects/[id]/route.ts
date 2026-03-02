import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        const { autoDrafts } = await req.json();

        // Ensure the project belongs to the user
        const project = await prisma.project.findFirst({
            where: { id, userId }
        });

        if (!project) {
            return new NextResponse("Project not found", { status: 404 });
        }

        const updated = await prisma.project.update({
            where: { id },
            data: { autoDrafts }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[PROJECT_UPDATE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
