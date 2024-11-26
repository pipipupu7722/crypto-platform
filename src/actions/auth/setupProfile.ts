"use server"

import { getCookies } from "@/lib/server/cookies"
import { wrapsa } from "@/lib/server/helpers"
import { tokensService } from "@/lib/server/services/tokens.service"
import { usersService } from "@/lib/server/services/users.service"
import { CookieKeys } from "@/lib/types"
import { ProfileSetupSchema, ProfileSetupSchemaType } from "@/schemas/auth.schemas"

const setupProfile = wrapsa(async (data: ProfileSetupSchemaType) => {
    const cookieStore = await getCookies()
    const accessToken = cookieStore.get(CookieKeys.UserAccessToken)?.value ?? ""
    const accessTokenPayload = await tokensService.verifyUserAccessToken(accessToken)

    const userData = ProfileSetupSchema.parse(data)
    const user = await usersService.update(accessTokenPayload.uid, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        country: userData.phone.isoCode,
        phone: "+" + userData.phone.countryCode + userData.phone.areaCode + userData.phone.phoneNumber,
    })
    cookieStore.delete(CookieKeys.MustSetupProfile)
})

export { setupProfile }
