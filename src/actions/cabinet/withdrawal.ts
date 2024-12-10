"use server"

import { AlreadyHasPendingWithdrawalError, BalanceIsTooLowError, ServerActionError } from "@/lib/errors"
import { wrapsa } from "@/lib/server/helpers"
import { transactionService } from "@/lib/server/services/transactions.service"
import { WithdrawalTransactionSchema, WithdrawalTransactionSchemaType } from "@/schemas/cabinet/transaction.schemas"

export const createWithdrawalRequest = wrapsa(async (userId: string, payload: WithdrawalTransactionSchemaType) => {
    try {
        return await transactionService.createWithdrawal(userId, WithdrawalTransactionSchema.parse(payload))
    } catch (error) {
        if (error instanceof AlreadyHasPendingWithdrawalError) {
            throw new ServerActionError("У вас уже есть активная заявка на вывод")
        }
        if (error instanceof BalanceIsTooLowError) {
            throw new ServerActionError("Недостаточно средств")
        }
        throw error
    }
})
