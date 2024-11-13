import { JWTInvalid } from "jose/errors"
import "server-only"

import { User } from "@prisma/client"

import { tokensService } from "./tokens.service"

import { prisma } from "../prisma"
import { appconf } from "@/appconf"
import { BadSessionError } from "@/lib/errors"
import { AuthTokenPair } from "@/lib/types"

class SessionsService {
    public async getWithUser(sessionId: string) {
        return prisma.session.findUnique({ where: { id: sessionId }, include: { user: true } })
    }

    public async create(user: User): Promise<AuthTokenPair> {
        const refreshToken = await tokensService.issueUserRefreshToken({ uid: user.id })

        const session = await prisma.session.create({
            data: {
                userId: user.id,
                refreshToken: refreshToken,
            },
        })

        const accessToken = await tokensService.issueUserAccessToken({
            sid: session.id,
            uid: user.id,
            sts: user.status,
            rls: user.roles,
        })

        return { accessToken, refreshToken }
    }

    public async refresh(refreshToken: string, uidFromVerifiedRefreshToken?: string): Promise<AuthTokenPair> {
        const userId = uidFromVerifiedRefreshToken ?? (await tokensService.verifyUserRefreshToken(refreshToken)).uid

        const session = await prisma.session.findUnique({ where: { refreshToken }, include: { user: true } })
        if (!session) {
            throw new BadSessionError("Session not found")
        }

        const newRefreshToken = await tokensService.issueUserRefreshToken({ uid: userId })

        await prisma.session.update({ where: { id: session.id }, data: { refreshToken: newRefreshToken } })

        const accessToken = await tokensService.issueUserAccessToken({
            sid: session.id,
            uid: userId,
            sts: session.user.status,
            rls: session.user.roles,
        })

        return { accessToken, refreshToken: newRefreshToken }
    }

    public async refreshOnEdgeRuntime(refreshToken: string): Promise<AuthTokenPair> {
        if (refreshToken) {
            const newTokenPairResult = await fetch(new URL("/actions/auth/refresh", appconf.APP_HOST), {
                method: "POST",
                body: JSON.stringify({ refreshToken: refreshToken }),
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
