"use server"

import { cookies } from "next/headers"
import { cache } from "react"

import { CookieKeys } from "../types"
import { appconf } from "@/appconf"

export const getCookies = cache(async () => await cookies())

export const setAuthCookies = async (accessToken: string | null, refreshToken: string | null) => {
    const cookieStore = await getCookies()
    if (accessToken) {
        cookieStore.set(CookieKeys.UserAccessToken, accessToken, {
            ...appconf.defaultSecureCookieOptions,
            maxAge: 60 * 60,
        })
    } else {
        cookieStore.delete(CookieKeys.UserAccessToken)
    }

    if (refreshToken) {
        cookieStore.set(CookieKeys.UserRefreshToken, refreshToken, {
            ...appconf.defaultSecureCookieOptions,
            maxAge: 60 * 60 * 24 * 7,
        })
    } else {
        cookieStore.delete(CookieKeys.UserRefreshToken)
    }
}
