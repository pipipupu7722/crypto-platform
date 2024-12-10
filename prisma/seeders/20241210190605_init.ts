import { CryptocurrencyStatus, CryptocurrencyType, PrismaClient, UserRole, UserStatus } from "@prisma/client"
import { hashSync } from "bcrypt"

import { appconf } from "./../../src/appconf"

export default async function seed(prisma: PrismaClient) {
    // extra check in case this seeder has been applied before Seeder model created
    if (await prisma.user.findFirst()) {
        return console.log(`🌱  First user already exists. Exiting database seeder...`)
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
                withdrawalMinUsd: 10,
                withdrawalMaxUsd: 100,
            },
        ],
    })
}
