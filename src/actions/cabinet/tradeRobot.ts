"use server"

import { wrapsa } from "@/lib/server/helpers"
import { tradeRobotsService } from "@/lib/server/services/tradeRobots.service"

export const startTradeRobot = wrapsa(
    async (tradeRobotId: string, amount: number) => await tradeRobotsService.start(tradeRobotId, amount)
)
