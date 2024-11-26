"use server"

import { setAuthCookies } from "@/lib/server/cookies"
import { wrapsa } from "@/lib/server/helpers"
import { sessionsService } from "@/lib/server/services/sessions.service"
import { getSessionPayload } from "@/lib/server/session"

const logout = wrapsa(async () => {
    const session = await getSessionPayload()
    if (session) {
        await sessionsService.revoke(session.sid)
        await setAuthCookies(null, null)
    }
})

export { logout }
