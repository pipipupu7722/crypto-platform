import { PrismaClient } from "@prisma/client"

export default async function seed(prisma: PrismaClient) {
    await prisma.cryptocurrency.update({
        where: {
            symbol: "USDT:TRC20",
        },
        data: {
            withdrawalMinUsd: 10,
            withdrawalMaxUsd: 100000,
        },
    })
}
