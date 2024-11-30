import { CryptocurrencyStatus } from "@prisma/client"

import { prisma } from "../providers/prisma"

class CryptocurrenciesService {
    constructor() {}

    public async getAll() {
        return await prisma.cryptocurrency.findMany()
    }

    public async getWithdrawable() {
        return await prisma.cryptocurrency.findMany({
            where: { status: CryptocurrencyStatus.ACTIVE, withdrawalMaxUsd: { gt: 0 } },
        })
    }

    public async getBySymbol(symbol: string) {
        return await prisma.cryptocurrency.findUnique({ where: { symbol } })
    }
    public async getBySymbolOrThrow(symbol: string) {
        return await prisma.cryptocurrency.findUniqueOrThrow({ where: { symbol } })
    }
}

export const cryptocurrenciesService = new CryptocurrenciesService()
