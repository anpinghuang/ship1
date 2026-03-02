require('dotenv').config();
const { prisma } = require('../src/lib/prisma');

async function main() {
    console.log("Creating mock project and activity event...");

    // 1. Get or create a user
    let user = await prisma.user.findFirst();
    if (!user) {
        user = await prisma.user.create({
            data: { name: "Test User", email: "test@example.com" }
        });
    }

    // 2. Get or create a project
    let project = await prisma.project.findFirst({ where: { userId: user.id } });
    if (!project) {
        project = await prisma.project.create({
            data: {
                userId: user.id,
                githubRepoId: "12345",
                githubRepoName: "anp/ship-in-public"
            }
        });
    }

    // 3. Create a mock push event
    const mockPayload = {
        repository: { id: "12345", full_name: "anp/ship-in-public" },
        commits: [
            { message: "feat: implemented robust AI mock pipeline" },
            { message: "fix: webhook signature validation edge case" }
        ]
    };

    await prisma.activityEvent.create({
        data: {
            projectId: project.id,
            eventType: "push",
            payload: mockPayload,
            processed: false
        }
    });

    console.log("Mock data created!");
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
