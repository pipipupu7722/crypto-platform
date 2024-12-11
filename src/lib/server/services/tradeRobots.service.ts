import { TradeRobotStatus } from "@prisma/client"
import { endOfDay } from "date-fns"

import { getRandomFloat } from "../helpers"
import { eventEmitter } from "../providers/event.emitter"
import { prisma } from "../providers/prisma"
import { usersService } from "./users.service"
import { appconf } from "@/appconf"
import { AppEvents } from "@/lib/events"
import { TradeRobotSchema, TradeRobotSchemaType } from "@/schemas/dashboard/tradeRobot.schemas"

class TradeRobotsService {
    constructor() {}

    public async create(userId: string, payload: TradeRobotSchemaType) {
        payload = TradeRobotSchema.parse(payload)
        if (!payload.closesAt) {
            throw Error("ClosesAt not specified")
        }
        const closesAt = endOfDay(new Date(payload.closesAt))

        const tradeRobot = await prisma.tradeRobot.create({ data: { ...payload, closesAt, userId } })

        eventEmitter.emit(AppEvents.NewTradeRobot, {
            userId: userId,
            tradeRobotId: tradeRobot.id,
            name: tradeRobot.name,
            profitMin: tradeRobot.fakeProfitMin,
            profitMax: tradeRobot.fakeProfitMax,
        })

        return tradeRobot
    }

    public async update(id: string, tradeRobot: TradeRobotSchemaType) {
        tradeRobot = TradeRobotSchema.parse(tradeRobot)
        const closesAt = tradeRobot.closesAt ? endOfDay(new Date(tradeRobot.closesAt)) : undefined

        return await prisma.tradeRobot.update({ where: { id }, data: { ...tradeRobot, closesAt } })
    }

    public async start(id: string, amount: number) {
        const tradeRobot = await prisma.tradeRobot.findUniqueOrThrow({
            where: { id, status: TradeRobotStatus.AVAILABLE },
        })
        const user = await prisma.user.findUniqueOrThrow({ where: { id: tradeRobot.userId } })

        if (user.balance - amount < 0) {
            throw new Error("Balance is too low")
        }

        await usersService.investFunds(user.id, amount)

        return await prisma.tradeRobot.update({
            where: { id },
            data: { status: TradeRobotStatus.ACTIVE, invested: amount, startedAt: new Date() },
        })
    }

    public async close(id: string) {
        const { invested, profit, userId, name } = await prisma.tradeRobot.findUniqueOrThrow({
            where: { id, status: TradeRobotStatus.ACTIVE },
        })

        eventEmitter.emit(AppEvents.TradeRobotClosed, { userId: userId, tradeRobotId: id, name, invested, profit })

        await usersService.takeProfit(userId, invested + profit)

        return await prisma.tradeRobot.update({
            where: { id },
            data: { status: TradeRobotStatus.CLOSED, closedAt: new Date() },
        })
    }

    public async getAllByUser(userId: string) {
        return await prisma.tradeRobot.findMany({ where: { userId }, orderBy: { status: "asc" } })
    }

    public async checkAndClose() {
        const tradeRobots = await prisma.tradeRobot.findMany({
            where: { status: TradeRobotStatus.ACTIVE, closesAt: { lte: new Date() } },
        })
        tradeRobots.forEach((tradeRobot) => tradeRobotsService.close(tradeRobot.id))
    }

    public async calcPnlForAll() {
        const userIds = await prisma.tradeRobot.groupBy({ by: ["userId"], where: { status: TradeRobotStatus.ACTIVE } })

        for (const { userId } of userIds) {
            const tradeRobots = await prisma.tradeRobot.findMany({ where: { userId, status: TradeRobotStatus.ACTIVE } })

            const tradeRobotUpdateQuery: { id: string; profitDelta: number }[] = []
            const pnlCreateQuery: { tradeRobotId: string; profitDelta: number }[] = []

            let totalProfitDelta = 0

            for (const tradeRobot of tradeRobots) {
                const { invested, realProfitMin, realProfitMax, createdAt, closesAt } = tradeRobot

                const totalMilliseconds = closesAt.getTime() - createdAt.getTime()
                const intervals = Math.floor(totalMilliseconds / appconf.tradeRobotIntervalMs)
                if (intervals <= 0) continue

                const minProfit = invested * realProfitMin
                const maxProfit = invested * realProfitMax

                const totalProfit = getRandomFloat(minProfit, maxProfit)
                const profitDelta = totalProfit / intervals

                tradeRobotUpdateQuery.push({ id: tradeRobot.id, profitDelta })
                pnlCreateQuery.push({ tradeRobotId: tradeRobot.id, profitDelta })
                totalProfitDelta += profitDelta
            }

            const result = await prisma.$transaction([
                ...tradeRobotUpdateQuery.map((data) =>
                    prisma.tradeRobot.update({
                        where: { id: data.id },
                        data: { profit: { increment: data.profitDelta } },
                    })
                ),
                prisma.tradeRobotPnl.createMany({ data: pnlCreateQuery }),
            ])

            await usersService.addProfit(userId, totalProfitDelta)

            eventEmitter.emit(AppEvents.TradeRobotsRecalculated, {
                userId,
                tradeRobots: tradeRobots.map((tradeRobot) => ({
                    id: tradeRobot.id,
                    profit: (result.find((item) => "id" in item && item.id === tradeRobot.id) as any)?.profit ?? 0,
                })),
            })
        }
    }
}

export const tradeRobotsService = new TradeRobotsService()
