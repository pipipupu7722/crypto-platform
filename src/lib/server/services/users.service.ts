import { User, UserRole, UserStatus } from "@prisma/client"
import { compareSync, hashSync } from "bcrypt"
import "server-only"

import { eventEmitter } from "../providers/event.emitter"
import { prisma } from "../providers/prisma"
import { appconf } from "@/appconf"
import { AppEvents } from "@/lib/events"
import { GetUsersSchemaType } from "@/schemas/dashboard/user.schemas"

class UsersService {
    public async create(
        userData: {
            username: string
            email: string
            password: string
        } & Partial<User>
    ) {
        return await prisma.user.create({
            data: {
                username: userData.username,
                email: userData.email,
                roles: userData.roles || [UserRole.USER],
                passwordHash: hashSync(userData.password, appconf.passwordHashRounds),
            },
        })
    }

    public async update(
        userId: string,
        data: Omit<{ password?: string } & Partial<User>, "balance" | "tradingBalance" | "withdrawnFunds">
    ) {
        if (data.country) {
            data.country = data.country.toUpperCase()
        }
        if (data.password) {
            data.passwordHash = hashSync(data.password, appconf.passwordHashRounds)
            data.password = undefined
        }
        return await prisma.user.update({ where: { id: userId }, data })
    }

    public async depositFunds(userId: string, diff: number) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                balance: { increment: diff },
            },
        })
        this.emitBalanceChanged(user)
    }

    public async withdrawFunds(userId: string, diff: number) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                balance: { decrement: diff },
                withdrawnFunds: { increment: diff },
            },
        })
        this.emitBalanceChanged(user)
    }

    public async investFunds(userId: string, diff: number) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                balance: { decrement: diff },
                tradingBalance: { increment: diff },
            },
        })
        this.emitBalanceChanged(user)
    }

    public async addProfit(userId: string, diff: number) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                tradingBalance: { increment: diff },
            },
        })
        this.emitBalanceChanged(user)
    }

    public async takeProfit(userId: string, diff: number) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                tradingBalance: { decrement: diff },
                balance: { increment: diff },
            },
        })
        this.emitBalanceChanged(user)
    }

    public async validate(email: string, password: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { email } })
        if (user && user.passwordHash && compareSync(password, user.passwordHash)) {
            return user
        } else {
            return null
        }
    }

    public async getByUsernameOrEmail(username: string, email: string): Promise<User | null> {
        return await prisma.user.findFirst({
            where: { OR: [{ username }, { email }] },
        })
    }

    public async getById(userId: string): Promise<User | null> {
        return await prisma.user.findUnique({ where: { id: userId } })
    }

    public async getAllManagers() {
        return await prisma.user.findMany({
            where: { roles: { has: UserRole.MANAGER } },
        })
    }

    public async getUsers({ searchQuery, page, pageSize, sortBy, sortOrder }: GetUsersSchemaType) {
        const where: any = {}
        if (searchQuery) {
            where.OR = [
                { email: { contains: searchQuery, mode: "insensitive" } },
                { firstName: { contains: searchQuery, mode: "insensitive" } },
                { lastName: { contains: searchQuery, mode: "insensitive" } },
            ]
        }

        const users = await prisma.user.findMany({
            where: { ...where, roles: { has: UserRole.USER } },
            orderBy: { [sortBy]: sortOrder || "asc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        })

        const totalCount = await prisma.user.count({ where })
        const usersCount = users.length
        const pagesCount = Math.ceil(totalCount / pageSize)

        return { users, usersCount, totalCount, page, pageSize, pagesCount }
    }

    public async approveRegistration(userId: string) {
        return await prisma.user.update({
            where: { id: userId, status: UserStatus.PENDING },
            data: { status: UserStatus.ACTIVE },
        })
    }
    public async rejectRegistration(userId: string) {
        return await prisma.user.update({
            where: { id: userId, status: UserStatus.PENDING },
            data: { status: UserStatus.REJECTED },
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

    private emitBalanceChanged(user: User) {
        eventEmitter.emit(AppEvents.BalanceChanged, {
            userId: user.id,
            balance: user.balance,
            tradingBalance: user.tradingBalance,
            withdrawnFunds: user.withdrawnFunds,
        })
    }
}

export const usersService = new UsersService()
