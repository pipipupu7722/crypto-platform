"use server"

import { wrapsa } from "@/lib/server/helpers"
import { transactionService } from "@/lib/server/services/transactions.service"
import { DepositTransactionSchema, DepositTransactionSchemaType } from "@/schemas/dashboard/transaction.schemas"

export const createDepositTransaction = wrapsa(
    async (userId: string, payload: DepositTransactionSchemaType) =>
        await transactionService.createDeposit(userId, DepositTransactionSchema.parse(payload))
)

export const updateTransaction = wrapsa(
    async (id: string, payload: DepositTransactionSchemaType) =>
        await transactionService.update(id, DepositTransactionSchema.parse(payload))
)
