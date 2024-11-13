const env = {
    APP_HOST: process.env.APP_HOST,

    NODE_ENV: process.env.NODE_ENV as string,

    PASSWORD_ROUNDS: 10 as number,

    JWT_SECRET: process.env.JWT_SECRET as string,

    DATABASE_URL: process.env.DATABASE_URL as string,
}

const appconf = {
    ...env,

    routes: {
        protected: ["/dashboard", "/auth/setup", "/auth/pending"],
        guest: ["/auth/signin", "/auth/signup"],
    },
    defaultSecureCookieOptions: {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365 * 100,
    },
}

export { appconf }
