import { NextRequest, NextResponse } from "next/server"

import { logger } from "@/lib/server/providers/logger"
import { strategiesService } from "@/lib/server/services/strategies.service"
import { tokensService } from "@/lib/server/services/tokens.service"
import { tradeRobotsService } from "@/lib/server/services/tradeRobots.service"

// endpoint required for instrumentation.ts
export const POST = async (req: NextRequest) => {
    const { accessToken } = await req.json()
    try {
        await tokensService.verifyServiceAccessToken(accessToken)
    } catch (error) {
        logger.warn(error, "Service Access Token error")
        return NextResponse.json({ error: "Not Authorized" }, { status: 401 })
    }

    try {
        await strategiesService.checkAndClose()
        await strategiesService.calcPnlForAll()

        await tradeRobotsService.checkAndClose()
        await tradeRobotsService.calcPnlForAll()

        return NextResponse.json({}, { status: 200 })
    } catch (error) {
        logger.error(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
