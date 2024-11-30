import { createSchemaFieldRule } from "antd-zod"
import { z } from "zod"

//
export const WithdrawalTransactionSchema = z.object({
    crypto: z.string({ message: "Выберите криптовалюту" }),
    wallet: z.string({ message: "Введите адрес своего кошелька" }),
    amountUsd: z.number({ message: "Введите сумму в долларах" }),
})
export const WithdrawalTransactionSchemaRule = createSchemaFieldRule(WithdrawalTransactionSchema)
export type WithdrawalTransactionSchemaType = z.infer<typeof WithdrawalTransactionSchema>
