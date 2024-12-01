import { createSchemaFieldRule } from "antd-zod"
import { z } from "zod"

//
export const StrategyStartSchema = z.object({
    amount: z.number({ message: "Введите сумму в долларах" }),
})
export const StrategyStartSchemaRule = createSchemaFieldRule(StrategyStartSchema)
export type StrategyStartSchemaType = z.infer<typeof StrategyStartSchema>
