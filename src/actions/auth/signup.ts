"use server"

import { appconf } from "@/appconf"
import { getCookies, setAuthCookies } from "@/lib/server/cookies"
import { wrapsa } from "@/lib/server/helpers"
import { sessionsService } from "@/lib/server/services/sessions.service"
import { usersService } from "@/lib/server/services/users.service"
import { CookieKeys } from "@/lib/types"
import { SignUpSchema, SignUpSchemaType } from "@/schemas/auth.schemas"

const signUp = wrapsa(async (data: SignUpSchemaType) => {
    const userData = SignUpSchema.parse(data)
    const alreadyRegisteredUser = await usersService.findByUsernameOrEmail(userData.username, userData.email)
    if (alreadyRegisteredUser?.username === userData.username) {
        return { error: "Username already taken" }
    } else if (alreadyRegisteredUser?.email === userData.email) {
        return { error: "Email already registered" }
    }

    const user = await usersService.create(userData)
    const { accessToken, refreshToken } = await sessionsService.create(user)

    await setAuthCookies(accessToken, refreshToken)
    const cookieStore = await getCookies()
    cookieStore.set(CookieKeys.MustSetupProfile, "true", appconf.defaultSecureCookieOptions)
})

export { signUp }
