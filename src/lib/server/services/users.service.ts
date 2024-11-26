import { User, UserStatus } from "@prisma/client"
import { compareSync, hashSync } from "bcrypt"
import "server-only"

import { eventEmitter } from "../providers/event.emitter"
import { prisma } from "../providers/prisma"
import { appconf } from "@/appconf"
import { AppEvents } from "@/lib/types"
import { GetUsersSchemaType } from "@/schemas/dashboard/user.schemas"

class UsersService {
    public async create(userData: { username: string; email: string; password: string } & Partial<User>) {
        return await prisma.user.create({
            data: {
                username: userData.username,
                email: userData.email,
                passwordHash: hashSync(userData.password, appconf.passwordHashRounds),
            },
        })
    }

    public async findByUsernameOrEmail(username: string, email: string): Promise<User | null> {
        return await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } })
    }

    public async findById(userId: string): Promise<User | null> {
        return await prisma.user.findUnique({ where: { id: userId } })
    }

    public async findMany({ searchQuery, page, pageSize, sortBy, sortOrder }: GetUsersSchemaType) {
        const where: any = {}
        if (searchQuery) {
            where.OR = [
                { email: { contains: searchQuery, mode: "insensitive" } },
                { firstName: { contains: searchQuery, mode: "insensitive" } },
                { lastName: { contains: searchQuery, mode: "insensitive" } },
            ]
        }

        const users = await prisma.user.findMany({
            where,
            orderBy: { [sortBy]: sortOrder || "asc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        })

        const totalCount = await prisma.user.count({ where })
        const usersCount = users.length
        const pagesCount = Math.ceil(totalCount / pageSize)

        return { users, usersCount, totalCount, page, pageSize, pagesCount }
    }

    public async validate(email: string, password: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { email } })
        if (user && user.passwordHash && compareSync(password, user.passwordHash)) {
            return user
        } else {
            return null
        }
    }

    public async update(userId: string, data: Partial<User>) {
        if (data.country) {
            data.country = data.country.toUpperCase()
        }
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
        eventEmitter.emit(AppEvents.BalanceChanged, { userId, balance: user.balance, diff })
    }

    public async approveRegistration(userId: string) {
        return await prisma.user.update({
            where: { id: userId, status: UserStatus.PENDING },
            data: { status: UserStatus.ACTIVE },
        })
    }
    public async ban(userId: string) {
        return await prisma.user.update({
            where: { id: userId },
            data: { status: UserStatus.BANNED },
        })
    }
    public async unban(userId: string) {
        return await prisma.user.update({
            where: { id: userId, status: UserStatus.BANNED },
            data: { status: UserStatus.ACTIVE },
        })
    }
}

export const usersService = new UsersService()
