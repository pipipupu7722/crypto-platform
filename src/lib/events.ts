export enum AppEvents {
    BalanceChanged = "BalanceChanged",
    StrategyClosed = "StrategyClosed",
    StrategiesRecalculated = "StrategiesRecalculated",
}

export type EventMap = {
    BalanceChanged: { userId: string; balance: number; tradingBalance: number; withdrawnFunds: number }
    StrategyClosed: { userId: string; strategyId: string; invested: number; profit: number }
    StrategiesRecalculated: { userId: string; strategies: { id: string; profit: number }[] }
}
