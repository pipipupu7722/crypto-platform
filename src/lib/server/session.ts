"use server"

import { JOSEError } from "jose/errors"
import { headers } from "next/headers"
import { cache } from "react"

import { UnauthorizedError } from "../errors"
import { setAuthCookies } from "./cookies"
import { logger } from "./providers/logger"
import { sessionsService } from "./services/sessions.service"
import { tokensService } from "./services/tokens.service"
import { AuthTokenPair, InternalSessionDataHeader, UserAccessTokenPayload, UserSession } from "@/lib/types"

export const getSessionPayload = async (): Promise<UserAccessTokenPayload> => {
    const session = (await headers()).get(InternalSessionDataHeader)
    if (!session) {
        throw new UnauthorizedError()
    }
    return JSON.parse(session)
}

export const getSession = cache(async (): Promise<UserSession> => {
    const payload = await getSessionPayload()
    const session = await sessionsService.getWithUser(payload.sid)
    if (session) {
        return session
    }
    throw new UnauthorizedError()
})

const recentlyRefreshedTokens = new Map<string, AuthTokenPair>()

export const verifyOrRefreshInEdgeRuntime = async (
    accessToken?: string,
    refreshToken?: string
): Promise<UserAccessTokenPayload | null> => {
    try {
        return await tokensService.verifyUserAccessToken(accessToken ?? "")
    } catch (error) {
        if (error instanceof JOSEError) {
            if (!refreshToken) {
                return null
            }

            if (recentlyRefreshedTokens.has(refreshToken)) {
                const newTokenPair = recentlyRefreshedTokens.get(refreshToken) as AuthTokenPair
                logger.info(newTokenPair, "Returned refreshed auth tokens from cache")
                await setAuthCookies(newTokenPair.accessToken, newTokenPair.refreshToken)
                return await tokensService.verifyUserAccessToken(newTokenPair.accessToken)
            }

            try {
                const newTokenPair = await sessionsService.refreshInEdgeRuntime(refreshToken)

                recentlyRefreshedTokens.set(refreshToken, newTokenPair)
                setTimeout(() => recentlyRefreshedTokens.delete(refreshToken), 30000)

                await setAuthCookies(newTokenPair.accessToken, newTokenPair.refreshToken)
                return await tokensService.verifyUserAccessToken(newTokenPair.accessToken)
            } catch (error) {
                if (!(error instanceof JOSEError)) {
                    logger.error(error, "Error refreshing session")
                }
                await setAuthCookies(null, null)
                return null
            }
        } else {
            logger.error(error, "Error refreshing session")
            return null
        }
    }
}
