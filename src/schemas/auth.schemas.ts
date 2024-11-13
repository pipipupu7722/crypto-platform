import { z } from "zod"

import { createSchemaFieldRule } from "antd-zod"

//
export const SignInSchema = z.object({
    email: z.string({ message: "Email is required" }).email({ message: "Invalid email address" }),
    password: z.string({ message: "Password is required" }).min(8, { message: "Password is too short" }),
})
export const SignInSchemaRule = createSchemaFieldRule(SignInSchema)
export type SignInSchemaType = z.infer<typeof SignInSchema>

//
export const SignUpSchema = SignInSchema.extend({
    username: z.string({ message: "Username is required" }).min(3, { message: "Username is too short" }),
    confirmPassword: z.string({ message: "Passwords don't match" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirm"],
})
export const SignUpSchemaRule = createSchemaFieldRule(SignUpSchema)
export type SignUpSchemaType = z.infer<typeof SignUpSchema>

//
export const ProfileSetupSchema = z.object({
    firstName: z.string({ message: "First name is required" }),
    lastName: z.string({ message: "Last name is required" }),
    phone: z.object({
        isoCode: z.string().length(2),
        countryCode: z.number(),
        phoneNumber: z.string(),
    }),
})
export const ProfileSetupSchemaRule = createSchemaFieldRule(ProfileSetupSchema)
export type ProfileSetupSchemaType = z.infer<typeof ProfileSetupSchema>
