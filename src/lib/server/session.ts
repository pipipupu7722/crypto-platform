"use server"

import { JOSEError } from "jose/errors"
import { cookies } from "next/headers"
import { cache } from "react"

import { sessionsService } from "./services/sessions.service"
import { tokensService } from "./services/tokens.service"

import { UnauthorizedError } from "../errors"
import { logger } from "./logger"
import { CookieKeys, UserAccessTokenPayload } from "@/lib/types"

export const getUserSessionPayload = cache(async (): Promise<UserAccessTokenPayload> => {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(CookieKeys.UserAccessToken)?.value
    if (!accessToken) {
        throw new UnauthorizedError()
    }
    try {
        return await tokensService.verifyUserAccessToken(accessToken)
    } catch (error) {
        if (!(error instanceof JOSEError)) {
            logger.error("Error getSessionTokenPayload session", (error as Error).stack)
        }
        throw new UnauthorizedError()
    }
})

export const getUserSession = cache(async () => {
    const payload = await getUserSessionPayload()
    if (payload) {
        const session = await sessionsService.getWithUser(payload.sid)
        if (session) {
            return session
        }
    }
    throw new UnauthorizedError()
})
