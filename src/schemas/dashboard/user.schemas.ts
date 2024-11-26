import { UserStatus } from "@prisma/client"
import { createSchemaFieldRule } from "antd-zod"
import { z } from "zod"

export const UserDetailsSchema = z.object({
    username: z.string({ message: "Введите имя пользователя" }),
    email: z.string({ message: "Введите email" }).email({ message: "Неправильный email" }),
    firstName: z.string({ message: "Введите имя" }),
    lastName: z.string({ message: "Введите фамилию" }),
    status: z.nativeEnum(UserStatus, { message: "Выберите статус" }),
    phone: z.object({
        isoCode: z.string().length(2),
        countryCode: z.number(),
        areaCode: z.string(),
        phoneNumber: z.string(),
    }),
})
export const UserDetailsSchemaRule = createSchemaFieldRule(UserDetailsSchema)
export type UserDetailsSchemaType = z.infer<typeof UserDetailsSchema>

//
export const GetUsersSchema = z.object({
    searchQuery: z.string().optional(),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(50),
    sortBy: z.enum(["status", "createdAt"]).default("status"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
})
export const GetUsersSchemaRule = createSchemaFieldRule(GetUsersSchema)
export type GetUsersSchemaType = z.infer<typeof GetUsersSchema>
