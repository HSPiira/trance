import { prisma } from '../lib/db/prisma'

async function main() {
    const users = await prisma.user.findMany({
        include: {
            clientProfile: true,
            counsellorProfile: true,
        },
    })
    console.log('Users in database:', JSON.stringify(users, null, 2))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect()) 