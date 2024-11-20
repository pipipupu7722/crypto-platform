"use server"

import { headers } from "next/headers"
import { cache } from "react"

import { sessionsService } from "./services/sessions.service"

import { UnauthorizedError } from "../errors"
import { InternalSessionDataHeader, UserAccessTokenPayload, UserSession } from "@/lib/types"

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
