import { StrategyStatus } from "@prisma/client"
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

    public async create(userId: string, payload: StrategySchemaType) {
        payload = StrategySchema.parse(payload)
        if (!payload.closesAt) {
            throw Error("ClosesAt not specified")
        }
        const closesAt = startOfDay(new Date(payload.closesAt))

        const strategy = await prisma.strategy.create({ data: { ...payload, closesAt, userId } })

        eventEmitter.emit(AppEvents.NewStrategy, {
            userId: userId,
            strategyId: strategy.id,
            name: strategy.name,
            profitMin: strategy.fakeProfitMin,
            profitMax: strategy.fakeProfitMax,
        })

        return strategy
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
        const { invested, profit, userId, name } = await prisma.strategy.findUniqueOrThrow({
            where: { id, status: StrategyStatus.ACTIVE },
        })

        eventEmitter.emit(AppEvents.StrategyClosed, { userId: userId, strategyId: id, name, invested, profit })

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

            const strategyUpdateQuery: { id: string; profitDelta: number }[] = []
            const pnlCreateQuery: { strategyId: string; profitDelta: number }[] = []

            let totalProfitDelta = 0

            for (const strategy of strategies) {
                const { invested, realProfitMin, realProfitMax, createdAt, closesAt } = strategy

                const totalMilliseconds = closesAt.getTime() - createdAt.getTime()
                const intervals = Math.floor(totalMilliseconds / appconf.strategyIntervalMs)
                if (intervals <= 0) continue

                const minProfit = invested * realProfitMin
                const maxProfit = invested * realProfitMax

                const totalProfit = getRandomFloat(minProfit, maxProfit)
                const profitDelta = totalProfit / intervals

                strategyUpdateQuery.push({ id: strategy.id, profitDelta })
                pnlCreateQuery.push({ strategyId: strategy.id, profitDelta })
                totalProfitDelta += profitDelta
            }

            const result = await prisma.$transaction([
                ...strategyUpdateQuery.map((data) =>
                    prisma.strategy.update({
                        where: { id: data.id },
                        data: { profit: { increment: data.profitDelta } },
                    })
                ),
                prisma.strategyPnl.createMany({ data: pnlCreateQuery }),
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
