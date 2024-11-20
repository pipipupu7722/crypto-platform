import ms from "ms"

import { NodeEnvs } from "./lib/types"

const dotEnv = {
    appHost: process.env.APP_HOST,

    env: process.env.NODE_ENV as NodeEnvs,

    passwordHashRounds: 10 as number,

    jwtUserAccessTokenExpirationMs: ms(process.env.JWT_USER_ACCESS_TOKEN_EXPIRATION as string),
    jwtUserRefreshTokenExpirationMs: ms(process.env.JWT_USER_REFRESH_TOKEN_EXPIRATION as string),
    jwtSecret: process.env.JWT_SECRET as string,

    databaseUrl: process.env.DATABASE_URL as string,
}

const appconf = {
    ...dotEnv,

    routes: {
        protected: ["/api", "/dashboard", "/auth/setup", "/auth/pending"],
        guest: ["/auth/signin", "/auth/signup"],
    },
    defaultSecureCookieOptions: {
        httpOnly: true,
        secure: dotEnv.env === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365 * 100,
    },
}

export { appconf }
