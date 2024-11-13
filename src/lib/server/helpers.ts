import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"
import "server-only"

import { CookieKeys } from "../types"
import { appconf } from "@/appconf"

type CookieStore = {
    set: (...args: [key: string, value: string, cookie?: Partial<ResponseCookie>]) => any
}

const setAuthTokensCookies = (cookieStore: CookieStore, accessToken: string, refreshToken: string) => {
    cookieStore.set(CookieKeys.UserAccessToken, accessToken, {
        ...appconf.defaultSecureCookieOptions,
        maxAge: 60 * 60 * 24 * 7,
    })
    cookieStore.set(CookieKeys.UserRefreshToken, refreshToken, {
        ...appconf.defaultSecureCookieOptions,
        maxAge: 60 * 60,
    })
}

const isProtectedUrl = (urlPath: string) => {
    for (const path of appconf.routes.protected) {
        if (urlPath.startsWith(path)) {
            return true
        }
    }
    return false
}
const isPublicUrl = (urlPath: string) => {
    return !isProtectedUrl(urlPath)
}
const isGuestUrl = (urlPath: string) => {
    for (const path of appconf.routes.guest) {
        if (urlPath.startsWith(path)) {
            return true
        }
    }
    return false
}

export { setAuthTokensCookies, isProtectedUrl, isPublicUrl, isGuestUrl }
