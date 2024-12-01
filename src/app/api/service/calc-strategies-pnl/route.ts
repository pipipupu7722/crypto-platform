import { NextRequest, NextResponse } from "next/server"

import { logger } from "@/lib/server/providers/logger"
import { strategiesService } from "@/lib/server/services/strategies.service"
import { tokensService } from "@/lib/server/services/tokens.service"

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
        await strategiesService.calcPnlForAll()

        return NextResponse.json({}, { status: 200 })
    } catch (error) {
        logger.error(error, "Error calculating PnL")
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
