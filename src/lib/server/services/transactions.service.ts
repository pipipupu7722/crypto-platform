import { Transaction, TransactionStatus, TransactionType } from "@prisma/client"

import { prisma } from "../providers/prisma"
import { cryptocurrenciesService } from "./cryptocurrencies.service"
import { depositWalletsService } from "./depositWallets.service"
import { usersService } from "./users.service"
import { round } from "@/lib/helpers"
import { WithdrawalTransactionSchemaType } from "@/schemas/cabinet/transaction.schemas"
import { DepositTransactionSchemaType } from "@/schemas/dashboard/transaction.schemas"

class TransactionsService {
    constructor() {}

    public async createDeposit(userId: string, transaction: DepositTransactionSchemaType) {
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
        await usersService.withdrawFunds(userId, transaction.amountUsd)

        return transaction
    }

    public async update(id: string, payload: Partial<Transaction>) {
        const transaction = await prisma.transaction.findUniqueOrThrow({ where: { id }, include: { Crypto: true } })
        const crypto = payload.crypto
            ? await cryptocurrenciesService.getBySymbolOrThrow(transaction.crypto)
            : transaction.Crypto

        payload.amount = round(transaction.amount, crypto.decimals)

        const { status, ...data } = payload

        const updated = await prisma.transaction.update({ where: { id }, data })

        if (status && status !== transaction.status) {
            return await this.setStatus(updated, status)
        }
        return updated
    }

    public async getUserTransactions(userId: string) {
        return await prisma.transaction.findMany({ where: { userId }, orderBy: { createdAt: "desc" } })
    }

    private async setStatus(transaction: Transaction, status: TransactionStatus) {
        const oldStatus = transaction.status

        if (transaction.type === TransactionType.DEPOSIT) {
            if (status === TransactionStatus.COMPLETE && oldStatus !== TransactionStatus.COMPLETE) {
                await usersService.depositFunds(transaction.userId, transaction.amountUsd)
            } else if (status !== TransactionStatus.COMPLETE && oldStatus === TransactionStatus.COMPLETE) {
                await usersService.depositFunds(transaction.userId, -transaction.amountUsd)
            }
        } else if (transaction.type === TransactionType.WITHDRAWAL) {
            if (status === TransactionStatus.CANCELLED && oldStatus !== TransactionStatus.CANCELLED) {
                await usersService.withdrawFunds(transaction.userId, -transaction.amountUsd)
            } else if (status !== TransactionStatus.CANCELLED && oldStatus === TransactionStatus.CANCELLED) {
                await usersService.withdrawFunds(transaction.userId, transaction.amountUsd)
            }
        }

        return await prisma.transaction.update({ where: { id: transaction.id }, data: { status } })
    }
}

export const transactionService = new TransactionsService()
