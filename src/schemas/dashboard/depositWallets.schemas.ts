import { DepositWalletStatus } from "@prisma/client"
import { createSchemaFieldRule } from "antd-zod"
import { z } from "zod"

//
export const DepositWalletSchema = z.object({
    crypto: z.string({ message: "Выберите криптовалюту" }),
    wallet: z.string({ message: "Введите адрес кошелька" }),
    status: z.nativeEnum(DepositWalletStatus, { message: "Выберите статус транзакции" }),
    description: z.string().nullable().optional(),
})
export const DepositWalletSchemaRule = createSchemaFieldRule(DepositWalletSchema)
export type DepositWalletSchemaType = z.infer<typeof DepositWalletSchema>
