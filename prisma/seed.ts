import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Create Demo User
    const user = await prisma.user.upsert({
        where: { email: "demo@shipinpublic.com" },
        update: {},
        create: {
            email: "demo@shipinpublic.com",
            name: "Demo Builder",
            tier: "PRO",
        },
    });

    // Create Project
    const project = await prisma.project.upsert({
        where: { githubRepoId: "123456" },
        update: {},
        create: {
            name: "ship-in-public",
            githubRepoId: "123456",
            userId: user.id,
        },
    });

    // Create Sample Rules
    await prisma.rule.createMany({
        data: [
            { type: "FILTER", content: "Ignore tests", userId: user.id, projectId: project.id },
            { type: "FORMAT", content: "Thread grouping", userId: user.id, projectId: project.id },
        ],
    });

    // Create Sample Posts
    await prisma.post.createMany({
        data: [
            {
                content: "Just implemented the AI pipeline! 🚀 #buildinpublic",
                status: "SCHEDULED",
                userId: user.id,
                projectId: project.id,
                scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 4), // 4 hours from now
            },
            {
                content: "Dashboard is looking premium. ✨",
                status: "POSTED",
                userId: user.id,
                projectId: project.id,
                publishedAt: new Date(),
            },
        ],
    });

    console.log("Seed data created successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
