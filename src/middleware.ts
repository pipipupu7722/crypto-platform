"use server"

import { JOSEError } from "jose/errors"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

import { UserStatuses } from "@prisma/client"

import { sessionsService } from "./lib/server/services/sessions.service"
import { tokensService } from "./lib/server/services/tokens.service"

import { appconf } from "./appconf"
import { isGuestUrl, isProtectedUrl, setAuthTokensCookies } from "./lib/server/helpers"
import { logger } from "./lib/server/logger"
import { CookieKeys, UserAccessTokenPayload } from "./lib/types"

const middleware = async (req: NextRequest, res: NextResponse) => {
    const path = req.nextUrl.pathname

    const cookieStore = await cookies()
    const accessToken = cookieStore.get(CookieKeys.UserAccessToken)?.value
    const refreshToken = cookieStore.get(CookieKeys.UserRefreshToken)?.value
    const mustSetupProfile = cookieStore.get(CookieKeys.MustSetupProfile)?.value

    if (isGuestUrl(path) && accessToken && refreshToken) {
        return NextResponse.redirect(new URL("/dashboard", appconf.APP_HOST))
    }

    if (isProtectedUrl(path)) {
        let accessTokenPayload = null
        try {
            accessTokenPayload = await tokensService.verifyUserAccessToken(accessToken as string)
        } catch (error) {
            if (error instanceof JOSEError) {
                try {
                    const newTokenPair = await sessionsService.refreshOnEdgeRuntime(refreshToken ?? "")
                    accessTokenPayload = await tokensService.verifyUserAccessToken(newTokenPair.accessToken)
                    setAuthTokensCookies(cookieStore, newTokenPair.accessToken, newTokenPair.refreshToken)
                } catch (error) {
                    if (!(error instanceof JOSEError)) {
                        logger.error("Error refreshing session", (error as Error).stack)
                    }
                    cookieStore.delete(CookieKeys.UserAccessToken)
                    cookieStore.delete(CookieKeys.UserRefreshToken)

                    return NextResponse.redirect(new URL("/auth/signin", appconf.APP_HOST))
                }
            }
        }
        accessTokenPayload = accessTokenPayload as UserAccessTokenPayload

        if (mustSetupProfile !== "true" && path.startsWith("/auth/setup")) {
            return NextResponse.redirect(new URL("/dashboard", appconf.APP_HOST))
        } else if (mustSetupProfile === "true") {
            if (path.startsWith("/auth/setup")) {
                return NextResponse.next()
            } else {
                return NextResponse.redirect(new URL("/auth/setup", appconf.APP_HOST))
            }
        }

        if (path.startsWith("/auth/pending") && accessTokenPayload.sts !== UserStatuses.PENDING) {
            return NextResponse.redirect(new URL("/dashboard", appconf.APP_HOST))
        } else if (accessTokenPayload.sts === UserStatuses.PENDING) {
            cookieStore.delete(CookieKeys.UserAccessToken)
            if (path.startsWith("/auth/pending")) {
                return NextResponse.next()
            } else {
                return NextResponse.redirect(new URL("/auth/pending", appconf.APP_HOST))
            }
        }
    }

    return NextResponse.next()
}

export default middleware

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
