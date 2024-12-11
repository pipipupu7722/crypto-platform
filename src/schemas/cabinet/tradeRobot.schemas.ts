import { createSchemaFieldRule } from "antd-zod"
import { z } from "zod"

//
export const TradeRobotStartSchema = z.object({
    amount: z.number({ message: "Введите сумму в долларах" }),
})
export const TradeRobotStartSchemaRule = createSchemaFieldRule(TradeRobotStartSchema)
export type TradeRobotStartSchemaType = z.infer<typeof TradeRobotStartSchema>
