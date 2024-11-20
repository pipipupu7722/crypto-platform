"use server"

import { JOSEError } from "jose/errors"

import { sessionsService } from "@/lib/server/services/sessions.service"

import { BadSessionError } from "@/lib/errors"
import { setAuthCookies } from "@/lib/server/cookies"
import { logger } from "@/lib/server/logger"
import { getSessionPayload } from "@/lib/server/session"

const signOut = async () => {
    try {
        const session = await getSessionPayload()
        if (session) {
            await sessionsService.revoke(session.sid)
            await setAuthCookies(null, null)
        }
        return { success: true }
    } catch (error) {
        if (!(error instanceof JOSEError) && !(error instanceof BadSessionError)) {
            logger.error("Error on signout: " + (error as Error).message, (error as Error).stack)
        }
        return { success: false }
    }
}

export { signOut }
