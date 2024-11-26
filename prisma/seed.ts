import { CryptocurrencyStatus, CryptocurrencyType, PrismaClient, UserRole, UserStatus } from "@prisma/client"
import { hashSync } from "bcrypt"

import { appconf } from "./../src/appconf"

const prisma = new PrismaClient()

;(async () => {
    const firstUser = await prisma.user.findFirst()
    if (firstUser) {
        return console.log(`\n🌱  First user already exists. Exiting database seeder...`)
    }

    await prisma.user.createMany({
        data: [
            {
                username: "admin",
                email: "admin@gmail.com",
                passwordHash: hashSync("asdasdasd", appconf.passwordHashRounds),
                firstName: "John",
                lastName: "Doe",
                country: "US",
                phone: "+12065550100",
                roles: [UserRole.ADMIN, UserRole.MANAGER],
                status: UserStatus.ACTIVE,
            },
        ],
    })

    await prisma.cryptocurrency.createMany({
        data: [
            {
                name: "USDT TRC-20",
                symbol: "USDT:TRC20",
                decimals: 6,
                type: CryptocurrencyType.TOKEN,
                status: CryptocurrencyStatus.ACTIVE,
                withdrawalLimitUsd: 100,
            },
        ],
    })
})()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
