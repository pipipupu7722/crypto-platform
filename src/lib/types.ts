import { Session, User, UserRole, UserStatus } from "@prisma/client"

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

export enum NotificationType {
    Info = "Info",
    WithRedirect = "WithRedirect",
}
export type NotificationMeta = {
    Info: { type: NotificationType.Info }
    WithRedirect: { type: NotificationType.WithRedirect; href: string }
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
