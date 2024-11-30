"use server"

import { wrapsa } from "@/lib/server/helpers"
import { transactionService } from "@/lib/server/services/transactions.service"
import { WithdrawalTransactionSchema, WithdrawalTransactionSchemaType } from "@/schemas/cabinet/transaction.schema"

export const createWithdrawalRequest = wrapsa(
    async (userId: string, payload: WithdrawalTransactionSchemaType) =>
        await transactionService.createWithdrawal(userId, WithdrawalTransactionSchema.parse(payload))
)
