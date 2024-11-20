"use server"

import { JOSEError } from "jose/errors"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

import { sessionsService } from "./lib/server/services/sessions.service"
import { tokensService } from "./lib/server/services/tokens.service"

import { appconf } from "./appconf"
import { getCookies, setAuthCookies } from "./lib/server/cookies"
import { isGuestUrl, isProtectedUrl } from "./lib/server/helpers"
import { logger } from "./lib/server/logger"
import { CookieKeys, InternalSessionDataHeader, UserAccessTokenPayload } from "./lib/types"
import { UserStatuses } from "@prisma/client"

const middleware = async (req: NextRequest) => {
    if (req.headers.get(InternalSessionDataHeader)) {
        return NextResponse.json({ error: "Bad Request" }, { status: 400 })
    }

    const path = req.nextUrl.pathname

    const cookieStore = await getCookies()
    const accessToken = cookieStore.get(CookieKeys.UserAccessToken)?.value
    const refreshToken = cookieStore.get(CookieKeys.UserRefreshToken)?.value
    const mustSetupProfile = cookieStore.get(CookieKeys.MustSetupProfile)?.value

    if (isGuestUrl(path) && accessToken && refreshToken) {
        return NextResponse.redirect(new URL("/dashboard", appconf.appHost))
    }

    if (isProtectedUrl(path)) {
        let accessTokenPayload = null

        const UnauthorizedResponse = () =>
            path.startsWith("/api")
                ? NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
                : NextResponse.redirect(new URL("/auth/signin", appconf.appHost))

        try {
            accessTokenPayload = await tokensService.verifyUserAccessToken(accessToken as string)
        } catch (error) {
            if (error instanceof JOSEError) {
                if (!refreshToken) {
                    return UnauthorizedResponse()
                }

                try {
                    const newTokenPair = await sessionsService.refreshOnEdgeRuntime(refreshToken)
                    accessTokenPayload = await tokensService.verifyUserAccessToken(newTokenPair.accessToken as string)
                    await setAuthCookies(newTokenPair.accessToken, newTokenPair.refreshToken)
                } catch (error) {
                    if (!(error instanceof JOSEError)) {
                        logger.error("Error refreshing session", (error as Error).stack)
                    }
                    await setAuthCookies(null, null)

                    return UnauthorizedResponse()
                }
            }
        }
        accessTokenPayload = accessTokenPayload as UserAccessTokenPayload

        const NextWithAuth = () => {
            const headers = new Headers(req.headers)
            headers.set(InternalSessionDataHeader, JSON.stringify(accessTokenPayload))
            return NextResponse.next({ request: new Request(req.url, { ...req, headers }) })
        }

        if (mustSetupProfile !== "true" && path.startsWith("/auth/setup")) {
            return NextResponse.redirect(new URL("/dashboard", appconf.appHost))
        } else if (mustSetupProfile === "true") {
            if (path.startsWith("/auth/setup")) {
                return NextWithAuth()
            } else {
                return NextResponse.redirect(new URL("/auth/setup", appconf.appHost))
            }
        }

        if (path.startsWith("/auth/pending") && accessTokenPayload.sts !== UserStatuses.PENDING) {
            return NextResponse.redirect(new URL("/dashboard", appconf.appHost))
        } else if (accessTokenPayload.sts === UserStatuses.PENDING) {
            cookieStore.delete(CookieKeys.UserAccessToken)
            if (path.startsWith("/auth/pending")) {
                return NextWithAuth()
            } else {
                return NextResponse.redirect(new URL("/auth/pending", appconf.appHost))
            }
        }

        return NextWithAuth()
    }

    return NextResponse.next()
}

export default middleware

export const config = {
    matcher: ["/((?!_next/static|_next/image|.*\\.png|.*\\.ico$).*)"],
}
