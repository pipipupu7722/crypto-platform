import { CryptocurrencyStatus, CryptocurrencyType, PrismaClient } from "@prisma/client"

export default async function seed(prisma: PrismaClient) {
    await prisma.cryptocurrency.createMany({
        data: [
            {
                name: "Bitcoin",
                symbol: "BTC",
                decimals: 8,
                type: CryptocurrencyType.COIN,
                status: CryptocurrencyStatus.ACTIVE,
                withdrawalMinUsd: 10,
                withdrawalMaxUsd: 100000,
            },
            {
                name: "Ethereum",
                symbol: "ETH",
                decimals: 18,
                type: CryptocurrencyType.COIN,
                status: CryptocurrencyStatus.ACTIVE,
                withdrawalMinUsd: 10,
                withdrawalMaxUsd: 100000,
            },
            {
                name: "Tronix",
                symbol: "TRX",
                decimals: 6,
                type: CryptocurrencyType.COIN,
                status: CryptocurrencyStatus.ACTIVE,
                withdrawalMinUsd: 10,
                withdrawalMaxUsd: 100000,
            },
            {
                name: "Binance Coin",
                symbol: "BNB",
                decimals: 8,
                type: CryptocurrencyType.COIN,
                status: CryptocurrencyStatus.ACTIVE,
                withdrawalMinUsd: 10,
                withdrawalMaxUsd: 100000,
            },
            {
                name: "Ton Coin",
                symbol: "TON",
                decimals: 8,
                type: CryptocurrencyType.COIN,
                status: CryptocurrencyStatus.ACTIVE,
                withdrawalMinUsd: 10,
                withdrawalMaxUsd: 100000,
            },
        ],
    })
}
