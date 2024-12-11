"use server"

import { ServerActionError } from "@/lib/errors"
import { wrapsa } from "@/lib/server/helpers"
import { depositWalletsService } from "@/lib/server/services/depositWallets.service"
import { usersService } from "@/lib/server/services/users.service"
import { ProfileSetupSchema } from "@/schemas/auth.schemas"
import { UserDetailsSchemaType } from "@/schemas/dashboard/user.schemas"

export const approveUserRegistration = wrapsa(async (userId: string) => {
    const depositWallets = await depositWalletsService.getByUser(userId)
    if (depositWallets.length === 0) {
        throw new ServerActionError(
            "Пожалуйста, подождите пока администратор создаст кошельки для пополнения для этого пользователя"
        )
    }
    return await usersService.approveRegistration(userId)
})

export const rejectUserRegistration = wrapsa(async (userId: string) => await usersService.rejectRegistration(userId))

export const banUser = wrapsa(async (userId: string) => await usersService.ban(userId))

export const unbanUser = wrapsa(async (userId: string) => await usersService.unban(userId))

export const resetPassword = wrapsa(async (userId: string) => ({
    newPassword: await usersService.resetPassword(userId),
}))

export const updateUserDetails = wrapsa(async (userId: string, userDetails: UserDetailsSchemaType) => {
    const details = ProfileSetupSchema.parse(userDetails)
    const phone = "+" + details.phone.countryCode + details.phone.areaCode + details.phone.phoneNumber
    return usersService.update(userId, { ...details, phone })
})
