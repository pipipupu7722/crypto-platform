"use server"

import { JOSEError } from "jose/errors"
import { cookies } from "next/headers"

import { tokensService } from "@/lib/server/services/tokens.service"
import { usersService } from "@/lib/server/services/users.service"

import { logger } from "@/lib/server/logger"
import { CookieKeys } from "@/lib/types"
import { ProfileSetupSchema, ProfileSetupSchemaType } from "@/schemas/auth.schemas"

const profileSetup = async (data: ProfileSetupSchemaType) => {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get(CookieKeys.UserAccessToken)?.value ?? ""
        const accessTokenPayload = await tokensService.verifyUserAccessToken(accessToken)

        const userData = ProfileSetupSchema.parse(data)
        const user = await usersService.update({
            id: accessTokenPayload.uid,
            firstName: userData.firstName,
            lastName: userData.lastName,
            country: userData.phone.isoCode,
            phone: userData.phone.phoneNumber,
        })
        cookieStore.delete(CookieKeys.MustSetupProfile)
        return { success: true }
    } catch (error) {
        if (error instanceof JOSEError) {
            return { error: "Unauthorized" }
        }
        logger.error("Error creating session: " + (error as Error).message, data)
        return { error: "Something went wrong" }
    }
}

export { profileSetup }
