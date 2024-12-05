"use server"

import { UserStatus } from "@prisma/client"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

import { appconf } from "./appconf"
import { dropAuthAccessToken, getCookies } from "./lib/server/cookies"
import { GetRealIp, hasRouteRole, isGuestUrl, isProtectedUrl } from "./lib/server/helpers"
import { tokensService } from "./lib/server/services/tokens.service"
import { verifyOrRefreshInEdgeRuntime } from "./lib/server/session"
import { CookieKeys, InternalSessionDataHeader } from "./lib/types"

const middleware = async (req: NextRequest) => {
    if (req.headers.get(InternalSessionDataHeader)) {
        return NextResponse.json({ error: "Bad Request" }, { status: 400 })
    }

    const ipAddress = await GetRealIp(req.headers)
    const urlPath = req.nextUrl.pathname
    const cookieStore = await getCookies()
    const accessToken = cookieStore.get(CookieKeys.UserAccessToken)?.value
    const refreshToken = cookieStore.get(CookieKeys.UserRefreshToken)?.value
    const mustSetupProfile = cookieStore.get(CookieKeys.MustSetupProfile)?.value

    if (isGuestUrl(urlPath)) {
        if (accessToken && refreshToken) {
            return NextResponse.redirect(new URL(appconf.routes.default.user, appconf.appHost))
        }
        return NextResponse.next()
    }

    if (isProtectedUrl(urlPath)) {
        if (urlPath.startsWith("/api/events")) {
            try {
                await tokensService.verifyUserAccessToken(accessToken as string)
            } catch (error) {
                return NextResponse.json({ error: "Access token expired" }, { status: 401 })
            }
        }

        const sessionPayload = await verifyOrRefreshInEdgeRuntime(ipAddress, accessToken, refreshToken)

        if (!sessionPayload) {
            return urlPath.startsWith("/api")
                ? NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
                : NextResponse.redirect(new URL("/auth/signin", appconf.appHost))
        }

        if (!hasRouteRole(urlPath, sessionPayload.rls)) {
            if (urlPath.startsWith("/cabinet")) {
                return NextResponse.redirect(new URL(appconf.routes.default.admin, appconf.appHost))
            } else if (urlPath.startsWith("/dashboard")) {
                return NextResponse.redirect(new URL("/cabine", appconf.appHost))
            } else {
                return NextResponse.json({ success: false, error: "Access Denied" }, { status: 403 })
            }
        }

        const NextWithAuth = () => {
            const headers = new Headers(req.headers)
            headers.set(InternalSessionDataHeader, JSON.stringify(sessionPayload))
            return NextResponse.next({ request: new Request(req.url, { ...req, headers }) })
        }
        if (mustSetupProfile !== "true" && urlPath.startsWith("/auth/setup")) {
            return NextResponse.redirect(new URL(appconf.routes.default.user, appconf.appHost))
        } else if (mustSetupProfile === "true") {
            if (urlPath.startsWith("/auth/setup")) {
                return NextWithAuth()
            } else {
                return NextResponse.redirect(new URL("/auth/setup", appconf.appHost))
            }
        }
        if (urlPath.startsWith("/auth/pending") && sessionPayload.sts !== UserStatus.PENDING) {
            return NextResponse.redirect(new URL(appconf.routes.default.user, appconf.appHost))
        } else if (sessionPayload.sts === UserStatus.PENDING) {
            await dropAuthAccessToken()

            if (urlPath.startsWith("/auth/pending")) {
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
