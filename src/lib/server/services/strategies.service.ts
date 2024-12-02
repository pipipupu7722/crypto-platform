import { Strategy, StrategyStatus } from "@prisma/client"
import { startOfDay } from "date-fns"

import { getRandomFloat } from "../helpers"
import { eventEmitter } from "../providers/event.emitter"
import { prisma } from "../providers/prisma"
import { usersService } from "./users.service"
import { appconf } from "@/appconf"
import { AppEvents } from "@/lib/events"
import { StrategySchema, StrategySchemaType } from "@/schemas/dashboard/strategy.schemas"

class StrategiesService {
    constructor() {}

    public async create(userId: string, strategy: StrategySchemaType) {
        strategy = StrategySchema.parse(strategy)
        if (!strategy.closesAt) {
            throw Error("ClosesAt not specified")
        }
        const closesAt = startOfDay(new Date(strategy.closesAt))

        return await prisma.strategy.create({ data: { ...strategy, closesAt, userId } })
    }

    public async update(id: string, strategy: StrategySchemaType) {
        strategy = StrategySchema.parse(strategy)
        const closesAt = strategy.closesAt ? startOfDay(new Date(strategy.closesAt)) : undefined

        return await prisma.strategy.update({ where: { id }, data: { ...strategy, closesAt } })
    }

    public async start(id: string, amount: number) {
        const strategy = await prisma.strategy.findUniqueOrThrow({ where: { id, status: StrategyStatus.AVAILABLE } })
        const user = await prisma.user.findUniqueOrThrow({ where: { id: strategy.userId } })

        if (user.balance - amount < 0) {
            throw new Error("Balance is too low")
        }

        await usersService.investFunds(user.id, amount)

        return await prisma.strategy.update({
            where: { id },
            data: { status: StrategyStatus.ACTIVE, invested: amount, startedAt: new Date() },
        })
    }

    public async close(id: string) {
        const { invested, profit, userId } = await prisma.strategy.findUniqueOrThrow({
            where: { id, status: StrategyStatus.ACTIVE },
        })

        eventEmitter.emit(AppEvents.StrategyClosed, { userId: userId, strategyId: id, invested, profit })

        await usersService.takeProfit(userId, invested + profit)

        return await prisma.strategy.update({
            where: { id },
            data: { status: StrategyStatus.CLOSED, closedAt: new Date() },
        })
    }

    public async getAllByUser(userId: string) {
        return await prisma.strategy.findMany({ where: { userId }, orderBy: { status: "asc" } })
    }

    public async checkAndClose() {
        const strategies = await prisma.strategy.findMany({
            where: { status: StrategyStatus.ACTIVE, closesAt: { lte: new Date() } },
        })
        strategies.forEach((strategy) => strategiesService.close(strategy.id))
    }

    public async calcPnlForAll() {
        const userIds = await prisma.strategy.groupBy({ by: ["userId"], where: { status: StrategyStatus.ACTIVE } })

        for (const { userId } of userIds) {
            const strategies = await prisma.strategy.findMany({ where: { userId, status: StrategyStatus.ACTIVE } })

            const strategyUpdates: { id: string; profitDelta: number }[] = []
            const pnlData: { strategyId: string; profitDelta: number }[] = []

            let totalProfitDelta = 0

            for (const strategy of strategies) {
                const { invested, realProfitMin, realProfitMax, createdAt, closesAt } = strategy

                const totalMilliseconds = closesAt.getTime() - createdAt.getTime()
                const intervals = Math.floor(totalMilliseconds / appconf.strategyIntervalMs)
                if (intervals <= 0) continue

                const minProfit = invested * (realProfitMin / 100)
                const maxProfit = invested * (realProfitMax / 100)

                const totalProfit = getRandomFloat(minProfit, maxProfit)
                const profitDelta = totalProfit / intervals

                strategyUpdates.push({ id: strategy.id, profitDelta })
                pnlData.push({ strategyId: strategy.id, profitDelta })
                totalProfitDelta += profitDelta
            }

            const result = await prisma.$transaction([
                ...strategyUpdates.map((data) =>
                    prisma.strategy.update({
                        where: { id: data.id },
                        data: { profit: { increment: data.profitDelta } },
                    })
                ),
                prisma.strategyPnl.createMany({ data: pnlData }),
            ])

            await usersService.addProfit(userId, totalProfitDelta)

            eventEmitter.emit(AppEvents.StrategiesRecalculated, {
                userId,
                strategies: strategies.map((strategy) => ({
                    id: strategy.id,
                    profit: (result.find((item) => "id" in item && item.id === strategy.id) as any)?.profit ?? 0,
                })),
            })
        }
    }
}

export const strategiesService = new StrategiesService()
