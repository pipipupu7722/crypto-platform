"use server"

import { appconf } from "@/appconf"
import { ServerActionError } from "@/lib/errors"
import { getCookies, setAuthCookies } from "@/lib/server/cookies"
import { GetRealIp, wrapsa } from "@/lib/server/helpers"
import { sessionsService } from "@/lib/server/services/sessions.service"
import { usersService } from "@/lib/server/services/users.service"
import { CookieKeys } from "@/lib/types"
import { SignInSchema, SignInSchemaType } from "@/schemas/auth.schemas"

const signIn = wrapsa(async (data: SignInSchemaType) => {
    const userData = SignInSchema.parse(data)
    const user = await usersService.validate(userData.email, userData.password)

    if (user) {
        const { accessToken, refreshToken } = await sessionsService.create(user, await GetRealIp())

        await setAuthCookies(accessToken, refreshToken)
        if (!user.firstName && !user.phone) {
            const cookieStore = await getCookies()
            cookieStore.set(CookieKeys.MustSetupProfile, "true", appconf.defaultSecureCookieOptions)
        }
    } else {
        throw new ServerActionError("Wrong email or password")
    }
})

export { signIn }
