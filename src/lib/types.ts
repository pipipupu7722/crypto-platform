import { UserRoles, UserStatuses } from "@prisma/client"

export enum CookieKeys {
    UserAccessToken = "UAT",
    UserRefreshToken = "URT",
    MustSetupProfile = "MSP",
}

export type AuthTokenPair = {
    accessToken: string
    refreshToken: string
}

export type UserAccessTokenPayload = {
    sid: string
    uid: string
    sts: UserStatuses
    rls: UserRoles[]
}

export type UserRefreshTokenPayload = {
    uid: string
}
