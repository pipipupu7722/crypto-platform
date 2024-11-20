import { usersService } from "./users.service"

import { prisma } from "../prisma"
import { TransactionStatus, TransactionType } from "@prisma/client"

export class TransactionsService {
    constructor() {}

    public async create(userId: string, amount: number, transactionType: TransactionType) {
        return await prisma.transaction.create({
            data: {
                userId,
                amount,
                type: transactionType,
            },
        })
    }

    public async complete(transactionId: string) {
        const transaction = await prisma.transaction.update({
            where: { id: transactionId },
            data: { status: TransactionStatus.COMPLETE },
        })
        if (!transaction.amount) {
            throw new Error("Approved transaction with no amount")
        }
        await usersService.updateBalance(transaction.userId, transaction.amount)

        return transaction
    }

    public async cancel(transactionId: string) {
        return await prisma.transaction.update({
            where: { id: transactionId },
            data: { status: TransactionStatus.CANCELLED },
        })
    }
}
