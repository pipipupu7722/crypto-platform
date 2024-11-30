import { JOSEError } from "jose/errors"
import { NextRequest, NextResponse } from "next/server"

import { BadSessionError } from "@/lib/errors"
import { logger } from "@/lib/server/providers/logger"
import { sessionsService } from "@/lib/server/services/sessions.service"

// endpoint required for SessionsService.refreshOnEdgeRuntime
export const POST = async (req: NextRequest) => {
    const { refreshToken, ipAddress } = await req.json()
    if (!refreshToken) {
        return NextResponse.json({ error: "Bad Request" }, { status: 400 })
    }

    try {
        const tokens = await sessionsService.refresh(ipAddress, refreshToken)
        return NextResponse.json(tokens, { status: 200 })
    } catch (error) {
        if (error instanceof JOSEError || error instanceof BadSessionError) {
            return NextResponse.json({ error: error.message }, { status: 401 })
        } else {
            logger.error(error, "Error updating session")
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
        }
    }
}
