import { createSchemaFieldRule } from "antd-zod"
import { z } from "zod"

export const TradeRobotSchema = z.object({
    name: z.string({ message: "Введите название" }),
    description: z.string().nullable().optional(),
    fakeProfitMin: z.number({ message: "Введите Fake PnL Min" }),
    fakeProfitMax: z.number({ message: "Введите Fake PnL Max" }),
    realProfitMin: z.number({ message: "Введите Real PnL Min" }),
    realProfitMax: z.number({ message: "Введите Real PnL Max" }),
    closesAt: z.string({ message: "Выберите дату" }).optional(),
})
export const TradeRobotSchemaRule = createSchemaFieldRule(TradeRobotSchema)
export type TradeRobotSchemaType = z.infer<typeof TradeRobotSchema>
