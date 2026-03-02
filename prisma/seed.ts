import { prisma } from '../src/lib/prisma'
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
    console.log('Seeding the database with mock ShipInPublic data...')

    // Clean up existing data for a fresh start
    await prisma.post.deleteMany({})
    await prisma.activityEvent.deleteMany({})
    await prisma.rule.deleteMany({})
    await prisma.project.deleteMany({})
    await prisma.user.deleteMany({})

    // 1. Create a mock user
    const user = await prisma.user.create({
        data: {
            name: 'Demo Architect',
            email: 'demo@builder.io',
            image: 'https://avatars.githubusercontent.com/u/101890?v=4',
        },
    })

    // 2. Create mock projects
    const projectA = await prisma.project.create({
        data: {
            userId: user.id,
            githubRepoId: '987654321',
            githubRepoName: 'anp/ship-in-public',
        },
    })

    const projectB = await prisma.project.create({
        data: {
            userId: user.id,
            githubRepoId: '123456789',
            githubRepoName: 'anp/nextjs-saas-starter',
        },
    })

    // 3. Create mock rules
    await prisma.rule.create({
        data: {
            projectId: projectA.id,
            userId: user.id,
            name: 'Ignore Commits',
            type: 'IGNORE_MESSAGE',
            config: { keywords: ['wip', 'chore', 'merge', 'debug'] },
        },
    })

    await prisma.rule.create({
        data: {
            projectId: projectA.id,
            userId: user.id,
            name: 'Formatter Exclusions',
            type: 'FORMATTING',
            config: { excludeFiles: ['*.md'], style: 'casual' }
        },
    })

    // 4. Create Activity Events
    await prisma.activityEvent.create({
        data: {
            projectId: projectA.id,
            eventType: 'push',
            payload: { commits: [{ message: 'feat: finished pipeline worker' }] },
            processed: true,
        }
    })

    // 5. Create Drafts, Scheduled, and Published Posts
    await prisma.post.create({
        data: {
            userId: user.id,
            content: 'Just natively integrated NextAuth for passwordless email magic link and GitHub. #buildinpublic',
            status: 'DRAFT',
            variants: [
                'Just natively integrated NextAuth for passwordless email magic link and GitHub. #buildinpublic',
                'Goodbye manual auth configs. NextAuth is hooked up for magic links and GitHub OAuth. 🚀',
                'Authentication layer complete. Now onto the fun part: shipping features. #indiedev'
            ],
            createdAt: new Date(Date.now() - 3600000) // 1 hr ago
        }
    })

    await prisma.post.create({
        data: {
            userId: user.id,
            content: 'We hit 1,000 active repos being tracked by our webhook ingester! Thanks for trusting us with your momentum. 🚀',
            status: 'SCHEDULED',
            createdAt: new Date(Date.now() - 7200000) // 2 hrs ago
        }
    })

    await prisma.post.create({
        data: {
            userId: user.id,
            content: 'Finally updated my Next.js starter template to use Tailwind v4 and React 19. The layout shift fixes are incredible.',
            status: 'PUBLISHED',
            platformIds: { x: 'tw_123456789' },
            createdAt: new Date(Date.now() - 86400000) // 1 day ago
        }
    })

    console.log('✅ Seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
