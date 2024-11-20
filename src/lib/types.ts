import { Session, User, UserRoles, UserStatuses } from "@prisma/client"

export const InternalSessionDataHeader = "x-session-data"

export enum NodeEnvs {
    Prod = "production",
    Dev = "development",
}

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

export type UserSession = Session & {
    user: User
}
