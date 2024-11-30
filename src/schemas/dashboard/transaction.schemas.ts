import { TransactionStatus } from "@prisma/client"
import { createSchemaFieldRule } from "antd-zod"
import { z } from "zod"

//
export const DepositTransactionSchema = z.object({
    crypto: z.string({ message: "Выберите криптовалюту" }),
    txHash: z.string({ message: "Введите хэш транзакции" }).nullable().optional(),
    amount: z.number({ message: "Введите сумму транзакции" }),
    amountUsd: z.number({ message: "Введите сумму в долларах" }),
    status: z.nativeEnum(TransactionStatus, { message: "Выберите статус транзакции" }),
    description: z.string().nullable().optional(),
})
export const DepositTransactionSchemaRule = createSchemaFieldRule(DepositTransactionSchema)
export type DepositWalletSchemaType = z.infer<typeof DepositTransactionSchema>
