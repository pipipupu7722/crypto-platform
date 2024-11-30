"use server"

import { UserRole } from "@prisma/client"

import { ServerActionError } from "@/lib/errors"
import { dropAuthAccessToken } from "@/lib/server/cookies"
import { ProtectSa, wrapsa } from "@/lib/server/helpers"
import { usersService } from "@/lib/server/services/users.service"
import { getSessionPayload } from "@/lib/server/session"
import { ManagerDetailsSchema, ManagerDetailsSchemaType } from "@/schemas/dashboard/manager.schemas"

export const createManager = wrapsa(async (userDetails: ManagerDetailsSchemaType) => {
    await ProtectSa([UserRole.ADMIN])

    const details = ManagerDetailsSchema.parse(userDetails)
    if (!details.password) {
        throw new ServerActionError("Пожалуйста, введите пароль")
    }
    return await usersService.create({ ...details, password: details.password, roles: [UserRole.MANAGER] })
})

export const updateManagerDetails = wrapsa(async (userId: string, userDetails: ManagerDetailsSchemaType) => {
    await ProtectSa([UserRole.ADMIN])

    const session = await getSessionPayload()
    if (userDetails.roles !== session.rls) {
        await dropAuthAccessToken()
    }

    return await usersService.update(userId, ManagerDetailsSchema.parse(userDetails))
})
