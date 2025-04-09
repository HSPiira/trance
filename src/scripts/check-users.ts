import { prisma } from '@/lib/db/prisma'

async function main() {
    const users = await prisma.user.findMany({
        where: {
            isDeleted: false
        }
    })

    console.log('Found', users.length, 'users')
    users.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - ${user.role}`)
    })
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect()) 