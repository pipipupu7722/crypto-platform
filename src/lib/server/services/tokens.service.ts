import { SignJWT, jwtVerify } from "jose"
import { JWTExpired, JWTInvalid } from "jose/errors"
import "server-only"

import { appconf } from "@/appconf"
import { UserAccessTokenPayload, UserRefreshTokenPayload } from "@/lib/types"

enum TokenTypes {
    UserAccessToken = "uat",
    UserRefreshToken = "urt",
}

class TokensService {
    private jwtSecret: Uint8Array

    constructor(secret: string) {
        this.jwtSecret = new TextEncoder().encode(secret)
    }

    public async issueUserAccessToken(payload: UserAccessTokenPayload): Promise<string> {
        return await new SignJWT({ tt: TokenTypes.UserAccessToken, ...payload })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("10m")
            .sign(this.jwtSecret)
    }
    public async verifyUserAccessToken(token: string): Promise<UserAccessTokenPayload> {
        return this.verifyToken(token, TokenTypes.UserAccessToken)
    }

    public async issueUserRefreshToken(payload: UserRefreshTokenPayload): Promise<string> {
        return await new SignJWT({ tt: TokenTypes.UserRefreshToken, ...payload })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("7d")
            .sign(this.jwtSecret)
    }
    public async verifyUserRefreshToken(token: string): Promise<UserRefreshTokenPayload> {
        return this.verifyToken(token, TokenTypes.UserRefreshToken)
    }

    public async isExpired(token: string): Promise<boolean> {
        try {
            await jwtVerify(token, this.jwtSecret)
            return false
        } catch (error) {
            if (error instanceof JWTExpired) {
                return true
            }
            throw error
        }
    }

    private async verifyToken(token: string, type: TokenTypes): Promise<any> {
        const payload = (await jwtVerify(token, this.jwtSecret)).payload
        return this.validateTokenPayload(payload, type)
    }
    private validateTokenPayload(payload: any, type: TokenTypes): any {
        const { tt, ...payloadData } = payload
        if (tt === type) {
            return payloadData
        } else {
            throw new JWTInvalid(`Wrong token type "${tt}" when expected "${type}"`)
        }
    }
}

export const tokensService = new TokensService(appconf.JWT_SECRET)
