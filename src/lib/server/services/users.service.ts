import { compareSync, hashSync } from "bcrypt"
import "server-only"

import { User } from "@prisma/client"

import { prisma } from "../prisma"
import { appconf } from "@/appconf"

class UsersService {
    public async findByUsernameOrEmail(username: string, email: string): Promise<User | null> {
        return await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } })
    }

    public async create(userData: { username: string; email: string; password: string }) {
        return await prisma.user.create({
            data: {
                username: userData.username,
                email: userData.email,
                passwordHash: hashSync(userData.password, appconf.PASSWORD_ROUNDS),
            },
        })
    }

    public async update(data: { id: string } & Partial<User>) {
        return await prisma.user.update({ data, where: { id: data.id } })
    }

    public async validate(email: string, password: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { email } })
        if (user && user.passwordHash && compareSync(password, user.passwordHash)) {
            return user
        } else {
            return null
        }
    }
}

export const usersService = new UsersService()
