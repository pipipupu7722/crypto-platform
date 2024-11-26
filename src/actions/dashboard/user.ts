"use server"

import { wrapsa } from "@/lib/server/helpers"
import { usersService } from "@/lib/server/services/users.service"
import { ProfileSetupSchema } from "@/schemas/auth.schemas"
import { UserDetailsSchemaType } from "@/schemas/dashboard/user.schemas"

export const approveUserRegistration = wrapsa(async (userId: string) => await usersService.approveRegistration(userId))

export const banUser = wrapsa(async (userId: string) => await usersService.ban(userId))

export const unbanUser = wrapsa(async (userId: string) => await usersService.unban(userId))

export const updateUserDetails = wrapsa(async (userId: string, userDetails: UserDetailsSchemaType) => {
    const details = ProfileSetupSchema.parse(userDetails)
    const phone = "+" + details.phone.countryCode + details.phone.areaCode + details.phone.phoneNumber
    return usersService.update(userId, { ...details, phone })
})
