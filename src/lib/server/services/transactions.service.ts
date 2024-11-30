import { Transaction, TransactionStatus, TransactionType } from "@prisma/client"

import { prisma } from "../providers/prisma"
import { cryptocurrenciesService } from "./cryptocurrencies.service"
import { depositWalletsService } from "./depositWallets.service"
import { usersService } from "./users.service"
import { round } from "@/lib/helpers"
import { WithdrawalTransactionSchemaType } from "@/schemas/cabinet/transaction.schema"
import { DepositWalletSchemaType } from "@/schemas/dashboard/transaction.schemas"

class TransactionsService {
    constructor() {}

    public async createDeposit(userId: string, transaction: DepositWalletSchemaType) {
        const crypto = await cryptocurrenciesService.getBySymbolOrThrow(transaction.crypto)
        const depositWallet = await depositWalletsService.getActiveByCrypto(crypto.symbol)

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

    public async createWithdrawal(userId: string, data: WithdrawalTransactionSchemaType) {
        const crypto = await cryptocurrenciesService.getBySymbolOrThrow(data.crypto)
        const user = await usersService.getById(userId)

        if (data.amountUsd > crypto.withdrawalMaxUsd || data.amountUsd < crypto.withdrawalMinUsd) {
            throw new Error("Amount is out of allowed bounds")
        } else if ((user?.balance ?? 0) - data.amountUsd < 0) {
            throw new Error("Balance is too low")
        }

        const transaction = await prisma.transaction.create({
            data: {
                ...data,
                userId,
                amount: 0,
                type: TransactionType.WITHDRAWAL,
            },
        })
        await usersService.updateBalance(userId, -transaction.amountUsd)

        return transaction
    }

    public async update(id: string, data: Partial<Transaction>) {
        const transaction = await prisma.transaction.findUniqueOrThrow({ where: { id }, include: { Crypto: true } })
        const crypto = data.crypto
            ? await cryptocurrenciesService.getBySymbolOrThrow(transaction.crypto)
            : transaction.Crypto

        data.amount = round(transaction.amount, crypto.decimals)

        const updated = await prisma.transaction.update({ where: { id }, data })

        if (data.status) {
            if (transaction.type === TransactionType.DEPOSIT) {
                if (
                    transaction.status !== TransactionStatus.COMPLETE &&
                    updated.status === TransactionStatus.COMPLETE
                ) {
                    await usersService.updateBalance(transaction.userId, transaction.amountUsd)
                } else if (
                    transaction.status === TransactionStatus.COMPLETE &&
                    updated.status !== TransactionStatus.COMPLETE
                ) {
                    await usersService.updateBalance(transaction.userId, -transaction.amountUsd)
                }
            } else if (transaction.type === TransactionType.WITHDRAWAL) {
                if (
                    transaction.status !== TransactionStatus.CANCELLED &&
                    updated.status === TransactionStatus.CANCELLED
                ) {
                    await usersService.updateBalance(transaction.userId, transaction.amountUsd)
                } else if (
                    transaction.status === TransactionStatus.CANCELLED &&
                    updated.status !== TransactionStatus.CANCELLED
                ) {
                    await usersService.updateBalance(transaction.userId, -transaction.amountUsd)
                }
            }
        }

        return updated
    }

    public async getUserTransactions(userId: string) {
        return prisma.transaction.findMany({ where: { userId }, orderBy: { createdAt: "desc" } })
    }
}

export const transactionService = new TransactionsService()
