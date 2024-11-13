import { JOSEError } from "jose/errors"
import { NextRequest, NextResponse } from "next/server"

import { sessionsService } from "@/lib/server/services/sessions.service"

import { BadSessionError } from "@/lib/errors"
import { logger } from "@/lib/server/logger"

// endpoint required for SessionsService.refreshOnEdgeRuntime
export const POST = async (req: NextRequest) => {
    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 })
    }

    const { refreshToken } = await req.json()
    if (!refreshToken) {
        return NextResponse.json({ error: "Bad Request" }, { status: 400 })
    }

    try {
        const tokens = await sessionsService.refresh(refreshToken)
        return NextResponse.json(tokens, { status: 200 })
    } catch (error) {
        if (error instanceof JOSEError || error instanceof BadSessionError) {
            return NextResponse.json({ error: error.message }, { status: 401 })
        } else {
            logger.error("Error updating session: " + (error as Error).message, (error as Error).stack)
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
        }
    }
}
