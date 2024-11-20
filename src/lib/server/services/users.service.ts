import { compareSync, hashSync } from "bcrypt"
import "server-only"

import { prisma } from "../prisma"
import { appconf } from "@/appconf"
import { User } from "@prisma/client"

class UsersService {
    public async findByUsernameOrEmail(username: string, email: string): Promise<User | null> {
        return await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } })
    }

    public async create(userData: { username: string; email: string; password: string }) {
        return await prisma.user.create({
            data: {
                username: userData.username,
                email: userData.email,
                passwordHash: hashSync(userData.password, appconf.passwordHashRounds),
            },
        })
    }

    public async validate(email: string, password: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { email } })
        if (user && user.passwordHash && compareSync(password, user.passwordHash)) {
            return user
        } else {
            return null
        }
    }

    public async updateProfile(userId: string, data: Partial<User>) {
        return await prisma.user.update({ where: { id: userId }, data })
    }

    public async updateBalance(userId: string, diff: number) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                balance: {
                    increment: diff,
                },
            },
        })
    }
}

export const usersService = new UsersService()
