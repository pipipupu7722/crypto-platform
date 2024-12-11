"use server"

import { wrapsa } from "@/lib/server/helpers"
import { strategiesService } from "@/lib/server/services/strategies.service"

export const startTradeRobot = wrapsa(
    async (tradeRobotId: string, amount: number) => await strategiesService.start(tradeRobotId, amount)
)
