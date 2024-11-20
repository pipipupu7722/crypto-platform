"use server"

import { sessionsService } from "@/lib/server/services/sessions.service"
import { usersService } from "@/lib/server/services/users.service"

import { appconf } from "@/appconf"
import { getCookies, setAuthCookies } from "@/lib/server/cookies"
import { logger } from "@/lib/server/logger"
import { CookieKeys } from "@/lib/types"
import { SignInSchema, SignInSchemaType } from "@/schemas/auth.schemas"

const signIn = async (data: SignInSchemaType) => {
    try {
        const userData = SignInSchema.parse(data)
        const user = await usersService.validate(userData.email, userData.password)

        if (user) {
            const { accessToken, refreshToken } = await sessionsService.create(user)

            await setAuthCookies(accessToken, refreshToken)
            if (!user.firstName && !user.phone) {
                const cookieStore = await getCookies()
                cookieStore.set(CookieKeys.MustSetupProfile, "true", appconf.defaultSecureCookieOptions)
            }

            return { success: true }
        } else {
            return { error: "Wrong email or password" }
        }
    } catch (error) {
        logger.error("Error creating session: " + (error as Error).message, data)
        return { error: "Something went wrong" }
    }
}

export { signIn }
