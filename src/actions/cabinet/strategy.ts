"use server"

import { wrapsa } from "@/lib/server/helpers"
import { strategiesService } from "@/lib/server/services/strategies.service"

export const startStrategy = wrapsa(
    async (strategyId: string, amount: number) => await strategiesService.start(strategyId, amount)
)
