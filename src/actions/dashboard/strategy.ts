"use server"

import { UserRole } from "@prisma/client"

import { ProtectSa, wrapsa } from "@/lib/server/helpers"
import { strategiesService } from "@/lib/server/services/strategies.service"
import { StrategySchema, StrategySchemaType } from "@/schemas/dashboard/strategy.schemas"

export const createStrategy = wrapsa(
    async (userId: string, payload: StrategySchemaType) =>
        await strategiesService.create(userId, StrategySchema.parse(payload))
)

export const updateStrategy = wrapsa(
    async (strategyId: string, payload: StrategySchemaType) =>
        await strategiesService.update(strategyId, StrategySchema.parse(payload))
)

export const startStrategy = wrapsa(
    async (strategyId: string, amount: number) => await strategiesService.start(strategyId, amount)
)

export const closeStrategy = wrapsa(async (strategyId: string) => {
    await ProtectSa([UserRole.ADMIN])

    return await strategiesService.close(strategyId)
})
