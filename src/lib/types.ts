import { Session, User, UserAuthLog, UserRole, UserStatus } from "@prisma/client"

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

export enum AppEvents {
    BalanceChanged = "BalanceChanged",
}

export type EventMap = {
    BalanceChanged: { userId: string; balance: number; tradingBalance: number; withdrawnFunds: number }
}

export type AuthTokenPair = {
    accessToken: string
    refreshToken: string
}

export type UserAccessTokenPayload = {
    sid: string
    uid: string
    sts: UserStatus
    rls: UserRole[]
}

export type UserRefreshTokenPayload = {
    uid: string
}

export type ServerAction<T> = (...args: any[]) => Promise<T>
export type ServerActionResponse<T> = ({ success: true } & Awaited<T>) | { success: false; error: string }

export type UserSession = Session & { User: User }
