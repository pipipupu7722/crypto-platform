import { User, UserAuthLogType } from "@prisma/client"
import { JWTInvalid } from "jose/errors"
import "server-only"

import { prisma } from "../providers/prisma"
import { tokensService } from "./tokens.service"
import { appconf } from "@/appconf"
import { BadSessionError } from "@/lib/errors"
import { AuthTokenPair } from "@/lib/types"

class SessionsService {
    public async getWithUser(sessionId: string) {
        return await prisma.session.findUnique({ where: { id: sessionId }, include: { User: true } })
    }

    public async getUserAuthLogs(userId: string) {
        return await prisma.userAuthLog.findMany({ where: { userId }, orderBy: { createdAt: "desc" } })
    }

    public async create(user: User, ipAddress: string): Promise<AuthTokenPair> {
        const refreshToken = await tokensService.issueUserRefreshToken({ uid: user.id })

        const session = await prisma.session.create({
            data: {
                userId: user.id,
                refreshToken: refreshToken,
                expiresAt: new Date(Date.now() + appconf.jwtUserRefreshTokenExpirationMs),
            },
        })

        const accessToken = await tokensService.issueUserAccessToken({
            sid: session.id,
            uid: user.id,
            sts: user.status,
            rls: user.roles,
        })

        await prisma.userAuthLog.create({
            data: {
                userId: user.id,
                sessionId: session.id,
                type: UserAuthLogType.LOGIN,
                ipAddress,
            },
        })

        return { accessToken, refreshToken }
    }

    public async revoke(sessionId: string) {
        return await prisma.session.update({
            where: { id: sessionId },
            data: {
                revokedAt: new Date(),
            },
        })
    }

    public async refresh(
        ipAddress: string,
        refreshToken: string,
        uidFromVerifiedRefreshToken?: string
    ): Promise<AuthTokenPair> {
        const userId = uidFromVerifiedRefreshToken ?? (await tokensService.verifyUserRefreshToken(refreshToken)).uid

        const session = await prisma.session.findUnique({ where: { refreshToken }, include: { User: true } })
        if (!session) {
            throw new BadSessionError("Session not found")
        } else if (session.revokedAt) {
            throw new BadSessionError("Session revoked")
        }

        const newRefreshToken = await tokensService.issueUserRefreshToken({ uid: userId })

        await prisma.session.update({
            where: { id: session.id },
            data: {
                refreshToken: newRefreshToken,
                expiresAt: new Date(Date.now() + appconf.jwtUserRefreshTokenExpirationMs),
            },
        })

        const accessToken = await tokensService.issueUserAccessToken({
            sid: session.id,
            uid: userId,
            sts: session.User.status,
            rls: session.User.roles,
        })

        await prisma.userAuthLog.create({
            data: {
                userId,
                sessionId: session.id,
                type: UserAuthLogType.REFRESH,
                ipAddress,
            },
        })

        return { accessToken, refreshToken: newRefreshToken }
    }

    public async refreshInEdgeRuntime(ipAddress: string, refreshToken: string): Promise<AuthTokenPair> {
        if (refreshToken) {
            const newTokenPairResult = await fetch(new URL("/api/auth/refresh", appconf.appHost), {
                method: "POST",
                body: JSON.stringify({ refreshToken, ipAddress }),
            })
            const newTokenPair = await newTokenPairResult.json()

            if (newTokenPairResult.ok) {
                return newTokenPair
            } else {
                throw new Error(newTokenPair.error)
            }
        } else {
            throw new JWTInvalid("Invalid refresh token")
        }
    }
}

export const sessionsService = new SessionsService()
