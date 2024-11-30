import { DepositWalletStatus } from "@prisma/client"

import { prisma } from "../providers/prisma"
import { DepositWalletSchemaType } from "@/schemas/dashboard/depositWallets.schemas"

class DepositWalletsService {
    constructor() {}

    public async getAll() {
        return await prisma.depositWallet.findMany()
    }

    public async getByUser(userId: string) {
        return await prisma.depositWallet.findMany({ where: { userId } })
    }

    public async getActiveByUser(userId: string) {
        return await prisma.depositWallet.findMany({ where: { userId, status: DepositWalletStatus.ACTIVE } })
    }

    public async getActiveByCrypto(crypto: string) {
        return await prisma.depositWallet.findFirstOrThrow({ where: { crypto, status: DepositWalletStatus.ACTIVE } })
    }

    public async create(userId: string, transaction: DepositWalletSchemaType) {
        return await prisma.depositWallet.create({
            data: {
                ...transaction,
                userId,
                description: transaction.description?.trim() ? transaction.description.trim() : null,
            },
        })
    }

    public async update(id: string, transaction: DepositWalletSchemaType) {
        return await prisma.depositWallet.update({
            data: {
                ...transaction,
                description: transaction.description?.trim() ? transaction.description.trim() : null,
            },
            where: { id },
        })
    }
}

export const depositWalletsService = new DepositWalletsService()
