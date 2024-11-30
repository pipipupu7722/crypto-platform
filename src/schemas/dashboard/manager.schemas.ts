import { UserRole, UserStatus } from "@prisma/client"
import { createSchemaFieldRule } from "antd-zod"
import { z } from "zod"

//
export const ManagerDetailsSchema = z.object({
    username: z.string({ message: "Введите юзернейм" }),
    email: z.string({ message: "Введите email" }).email({ message: "Неправильный email" }),
    password: z.string({ message: "Введите пароль" }).min(8, { message: "Пароль лишком короткий" }).optional(),
    roles: z.array(z.nativeEnum(UserRole), { message: "Выберите роли" }),
    status: z.nativeEnum(UserStatus, { message: "Выберите статус" }),
})
export const ManagerDetailsSchemaRule = createSchemaFieldRule(ManagerDetailsSchema)
export type ManagerDetailsSchemaType = z.infer<typeof ManagerDetailsSchema>
