import { UserRole } from "@prisma/client"
import ms from "ms"

import { NodeEnvs } from "./lib/types"

const dotEnv = {
    isBuilding: process.env.IS_BUILDING === "true",

    appHost: process.env.APP_HOST,
    appName: "Platform",

    runtime: process.env.NEXT_RUNTIME,
    env: process.env.NODE_ENV as NodeEnvs,

    passwordHashRounds: 10 as number,
    strategyIntervalMs: 30000 as number,
    tradeRobotIntervalMs: 30000 as number,

    jwtUserAccessTokenExpirationMs: ms(process.env.JWT_USER_ACCESS_TOKEN_EXPIRATION ?? "0"),
    jwtUserRefreshTokenExpirationMs: ms(process.env.JWT_USER_REFRESH_TOKEN_EXPIRATION ?? "0"),
    jwtServiceAccessTokenExpirationMs: ms(process.env.JWT_SERVICE_ACCESS_TOKEN_EXPIRATION ?? "0"),
    jwtSecret: process.env.JWT_SECRET as string,

    redisUrl: process.env.REDIS_URL as string,
    databaseUrl: process.env.DATABASE_URL as string,
}

const appconf = {
    ...dotEnv,

    routes: {
        default: {
            user: "/cabinet/strategies",
            admin: "/dashboard",
        },
        guest: ["/auth/signin", "/auth/signup", "/api/auth/refresh"],
        protected: [
            { path: "/auth/setup" },
            { path: "/auth/pending" },

            { path: "/api/dashboard", roles: [UserRole.ADMIN, UserRole.MANAGER] },
            { path: "/api/cabinet", roles: [UserRole.USER] },
            { path: "/api/events" },
            { path: "/api/auth" },

            { path: "/dashboard/managers", roles: [UserRole.ADMIN] },
            { path: "/dashboard", roles: [UserRole.ADMIN, UserRole.MANAGER] },
            { path: "/cabinet", roles: [UserRole.USER] },
            { path: "/cabinet/robot", roles: [UserRole.USER] },
        ],
    },

    defaultSecureCookieOptions: {
        httpOnly: true,
        secure: dotEnv.env === NodeEnvs.Prod,
        path: "/",
        maxAge: 60 * 60 * 24 * 365 * 100,
    },
}

export { appconf }
