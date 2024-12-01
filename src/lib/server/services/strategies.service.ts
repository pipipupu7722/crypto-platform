import { StrategyStatus } from "@prisma/client"
import { startOfDay } from "date-fns"

import { getRandomFloat } from "../helpers"
import { prisma } from "../providers/prisma"
import { usersService } from "./users.service"
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
        const strategy = await prisma.strategy.findUniqueOrThrow({ where: { id, status: StrategyStatus.ACTIVE } })

        await usersService.takeProfit(strategy.userId, strategy.profit)

        return await prisma.strategy.update({
            where: { id },
            data: { status: StrategyStatus.CLOSED, closedAt: new Date() },
        })
    }

    public async getAllByUser(userId: string) {
        return await prisma.strategy.findMany({ where: { userId } })
    }

    public async calcPnlForAll() {
        const strategies = await prisma.strategy.findMany({ where: { status: StrategyStatus.ACTIVE } })

        const updateData: { id: string; profitDelta: number }[] = []
        const pnlData: { strategyId: string; profitDelta: number }[] = []

        for (const strategy of strategies) {
            const { invested, profit, realProfitMin, realProfitMax } = strategy

            const coefficient = (strategy.closesAt.getTime() - (strategy.startedAt?.getTime() ?? 0)) / 30
            const profitDelta = ((invested + profit) * getRandomFloat(realProfitMin, realProfitMax)) / coefficient

            updateData.push({ id: strategy.id, profitDelta })
            pnlData.push({ strategyId: strategy.id, profitDelta })
        }

        await prisma.$transaction([
            ...updateData.map((data) =>
                prisma.strategy.update({
                    where: { id: data.id },
                    data: { profit: { increment: data.profitDelta } },
                })
            ),
            prisma.strategyPnl.createMany({ data: pnlData }),
        ])

        // const userStrategies = Object.groupBy(strategies, (strategy) => strategy.userId)

        // TODO: emit StrategiesPnlUpdated event
    }
}

export const strategiesService = new StrategiesService()
