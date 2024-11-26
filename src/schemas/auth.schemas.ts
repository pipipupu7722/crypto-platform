import { createSchemaFieldRule } from "antd-zod"
import { z } from "zod"

//
export const SignInSchema = z.object({
    email: z.string({ message: "Введите email" }).email({ message: "Неправильный email" }),
    password: z.string({ message: "Введите пароль" }).min(8, { message: "Пароль лишком короткий" }),
})
export const SignInSchemaRule = createSchemaFieldRule(SignInSchema)
export type SignInSchemaType = z.infer<typeof SignInSchema>

//
export const SignUpSchema = SignInSchema.extend({
    username: z.string({ message: "Введите имя пользователя" }).min(3, { message: "Введите имя слишком короткое" }),
    confirmPassword: z.string({ message: "Пароли не совпадают" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirm"],
})
export const SignUpSchemaRule = createSchemaFieldRule(SignUpSchema)
export type SignUpSchemaType = z.infer<typeof SignUpSchema>

//
export const ProfileSetupSchema = z.object({
    firstName: z.string({ message: "Введите имя" }),
    lastName: z.string({ message: "Введите фамилию" }),
    phone: z.object({
        isoCode: z.string().length(2),
        countryCode: z.number(),
        areaCode: z.string(),
        phoneNumber: z.string(),
    }),
})
export const ProfileSetupSchemaRule = createSchemaFieldRule(ProfileSetupSchema)
export type ProfileSetupSchemaType = z.infer<typeof ProfileSetupSchema>
