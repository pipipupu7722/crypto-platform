import { Transaction, TransactionStatus, TransactionType } from "@prisma/client"

import { eventEmitter } from "../providers/event.emitter"
import { prisma } from "../providers/prisma"
import { cryptocurrenciesService } from "./cryptocurrencies.service"
import { depositWalletsService } from "./depositWallets.service"
import { usersService } from "./users.service"
import { AlreadyHasPendingWithdrawalError, BalanceIsTooLowError } from "@/lib/errors"
import { AppEvents } from "@/lib/events"
import { round } from "@/lib/helpers"
import { WithdrawalTransactionSchemaType } from "@/schemas/cabinet/transaction.schemas"
import { DepositTransactionSchemaType } from "@/schemas/dashboard/transaction.schemas"

class TransactionsService {
    constructor() {}

    public async createDeposit(userId: string, data: DepositTransactionSchemaType) {
        const crypto = await cryptocurrenciesService.getBySymbolOrThrow(data.crypto)
        const depositWallet = await depositWalletsService.getActiveByCrypto(crypto.symbol)

        const transaction = await prisma.transaction.create({
            data: {
                ...data,
                userId,
                wallet: depositWallet.wallet,
                amount: round(data.amount, crypto.decimals),
                type: TransactionType.DEPOSIT,
                description: data.description ?? null,
            },
        })

        if (transaction.status === TransactionStatus.COMPLETE) {
            await usersService.depositFunds(userId, transaction.amountUsd)
        }

        return transaction
    }

    public async createWithdrawal(userId: string, data: WithdrawalTransactionSchemaType) {
        let crypto
        if (data.crypto) {
            crypto = await cryptocurrenciesService.getBySymbolOrThrow(data.crypto)
        }

        const user = await usersService.getById(userId)

        if (!user) {
            throw new Error(`Invalid userId ${userId}`)
        }

        const pendingWithdrawal = await prisma.transaction.findFirst({
            where: { userId: user.id, type: TransactionType.WITHDRAWAL, status: TransactionStatus.PENDING },
        })

        // TODO: fix
        // if (data.amountUsd > 10 || data.amountUsd < 100000) {
        //    throw new Error("Amount is out of allowed bounds")
        //}
        if ((user?.balance ?? 0) - data.amountUsd < 0) {
            throw new BalanceIsTooLowError()
        } else if (pendingWithdrawal) {
            throw new AlreadyHasPendingWithdrawalError()
        }

        const transaction = await prisma.transaction.create({
            data: {
                ...data,
                userId,
                amount: 0,
                type: TransactionType.WITHDRAWAL,
            },
        })

        if (transaction.status !== TransactionStatus.CANCELLED) {
            await usersService.withdrawFunds(userId, transaction.amountUsd)
        }

        return transaction
    }

    public async update(id: string, payload: Partial<Transaction>) {
        const transaction = await prisma.transaction.findUniqueOrThrow({ where: { id }, include: { Crypto: true } })
        // TODO: fix
        // const crypto = payload.crypto
        //     ? await cryptocurrenciesService.getBySymbolOrThrow(transaction.crypto)
        //     : transaction.Crypto

        // payload.amount = round(transaction.amount, crypto.decimals)

        payload.amount = round(transaction.amount, 6)

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

        if (status === TransactionStatus.COMPLETE && oldStatus !== TransactionStatus.COMPLETE) {
            eventEmitter.emit(AppEvents.TransactionConfirmed, {
                userId: transaction.userId,
                transactionId: transaction.id,
                type: transaction.type,
                amountUsd: transaction.amountUsd,
            })
        }

        return await prisma.transaction.update({ where: { id: transaction.id }, data: { status } })
    }
}

export const transactionService = new TransactionsService()
