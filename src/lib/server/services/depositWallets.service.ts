import { DepositWalletStatus } from "@prisma/client"

import { prisma } from "../providers/prisma"

class DepositWalletsService {
    constructor() {}

    public async getAll() {
        return await prisma.depositWallet.findMany()
    }

    public async getForDeposit(crypto: string) {
        return await prisma.depositWallet.findFirstOrThrow({ where: { crypto, status: DepositWalletStatus.ACTIVE } })
    }
}

export const depositWalletsService = new DepositWalletsService()
