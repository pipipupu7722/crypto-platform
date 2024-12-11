"use server"

import { UserRole } from "@prisma/client"

import { ProtectSa, wrapsa } from "@/lib/server/helpers"
import { strategiesService } from "@/lib/server/services/strategies.service"
import { TradeRobotSchema, TradeRobotSchemaType } from "@/schemas/dashboard/tradeRobot.schemas"

export const createTradeRobot = wrapsa(
    async (userId: string, payload: TradeRobotSchemaType) =>
        await strategiesService.create(userId, TradeRobotSchema.parse(payload))
)

export const updateTradeRobot = wrapsa(
    async (tradeRobotId: string, payload: TradeRobotSchemaType) =>
        await strategiesService.update(tradeRobotId, TradeRobotSchema.parse(payload))
)

export const closeTradeRobot = wrapsa(async (tradeRobotId: string) => {
    await ProtectSa([UserRole.ADMIN])

    return await strategiesService.close(tradeRobotId)
})
