import { Notification, TransactionType } from "@prisma/client"

export enum AppEvents {
    BalanceChanged = "BalanceChanged",

    TransactionConfirmed = "TransactionConfirmed",

    NewStrategy = "NewStrategy",
    StrategyClosed = "StrategyClosed",
    StrategiesRecalculated = "StrategiesRecalculated",

    NewNotification = "NewNotification",
    NotificationRead = "NotificationRead",
}

export type EventMap = {
    BalanceChanged: { userId: string; balance: number; tradingBalance: number; withdrawnFunds: number }

    TransactionConfirmed: { userId: string; transactionId: string; type: TransactionType; amountUsd: number }

    NewStrategy: { userId: string; strategyId: string; name: string; profitMin: number; profitMax: number }
    StrategyClosed: { userId: string; strategyId: string; name: string; invested: number; profit: number }
    StrategiesRecalculated: { userId: string; strategies: { id: string; profit: number }[] }

    NewNotification: Notification
    NotificationRead: { userId: string; notificationId: string }
}
