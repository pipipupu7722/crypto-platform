import { Transaction, TransactionStatus, TransactionType } from "@prisma/client"

import { prisma } from "../providers/prisma"
import { cryptocurrenciesService } from "./cryptocurrencies.service"
import { depositWalletsService } from "./depositWallets.service"
import { usersService } from "./users.service"
import { round } from "@/lib/helpers"
import { DepositTransactionSchemaType } from "@/schemas/dashboard/transaction.schemas"

class TransactionsService {
    constructor() {}

    public async createDeposit(userId: string, transaction: DepositTransactionSchemaType) {
        const crypto = await cryptocurrenciesService.getBySymbolOrThrow(transaction.crypto)
        const depositWallet = await depositWalletsService.getForDeposit(crypto.symbol)

        return await prisma.transaction.create({
            data: {
                ...transaction,
                userId,
                wallet: depositWallet.wallet,
                amount: round(transaction.amount, crypto.decimals),
                type: TransactionType.DEPOSIT,
                description: transaction.description ?? null,
            },
        })
    }

    public async update(id: string, data: Partial<Transaction>) {
        const transaction = await prisma.transaction.findUniqueOrThrow({ where: { id }, include: { Crypto: true } })
        const crypto = data.crypto
            ? await cryptocurrenciesService.getBySymbolOrThrow(transaction.crypto)
            : transaction.Crypto

        data.amount = round(transaction.amount, crypto.decimals)

        const updated = await prisma.transaction.update({ where: { id }, data })

        if (data.status) {
            if (transaction.status !== TransactionStatus.COMPLETE && updated.status === TransactionStatus.COMPLETE) {
                await usersService.updateBalance(transaction.userId, transaction.amountUsd)
            } else if (
                transaction.status === TransactionStatus.COMPLETE &&
                updated.status !== TransactionStatus.COMPLETE
            ) {
                await usersService.updateBalance(transaction.userId, -transaction.amountUsd)
            }
        }

        return updated
    }

    public async getUserTransactions(userId: string) {
        return prisma.transaction.findMany({ where: { userId }, orderBy: { createdAt: "desc" } })
    }
}

export const transactionService = new TransactionsService()
