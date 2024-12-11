import { NotificationStatus, TransactionType } from "@prisma/client"

import { prisma } from "../providers/prisma"
import { sseEmitter } from "../providers/sse.emitter"
import { AppEvents, EventMap } from "@/lib/events"
import { NotificationMeta, NotificationType } from "@/lib/types"

class NotificationsService {
    constructor() {}

    public async getAllByUser(userId: string) {
        return await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        })
    }

    public async markAsRead(notificationId: string): Promise<void> {
        const notification = await prisma.notification.update({
            where: { id: notificationId },
            data: { status: NotificationStatus.READ },
        })
        sseEmitter.emit(AppEvents.NotificationRead, notification.userId, {
            notificationId: notification.id,
        })
    }

    public async sendCustomNotification(userId: string, title: string, description: string) {
        const meta: NotificationMeta[NotificationType.Info] = {
            type: NotificationType.Info,
        }

        const notification = await prisma.notification.create({
            data: {
                userId: userId,
                title: title,
                description: description,
                meta,
            },
        })
        sseEmitter.emit(AppEvents.NewNotification, userId, notification)
    }

    public async sendTransactionConfirmedNotification(
        payload: EventMap[AppEvents.TransactionConfirmed]
    ): Promise<void> {
        const meta: NotificationMeta[NotificationType.Info] = {
            type: NotificationType.Info,
        }
        const notification = await prisma.notification.create({
            data: {
                userId: payload.userId,
                title: payload.type === TransactionType.DEPOSIT ? "Ваш баланс пополнен!" : "Вывод средств осуществлен!",
                description:
                    payload.type === TransactionType.DEPOSIT
                        ? `Средства в размере ${payload.amountUsd.toFixed(2)} $ зачислены на ваш баланс`
                        : `Средства в размере ${payload.amountUsd.toFixed(2)} $ отправлены на указанный вами кошелек`,
                meta,
            },
        })
        sseEmitter.emit(AppEvents.NewNotification, payload.userId, notification)
    }

    public async sendStrategyClosedNotification(payload: EventMap[AppEvents.StrategyClosed]): Promise<void> {
        const meta: NotificationMeta[NotificationType.Info] = {
            type: NotificationType.Info,
        }
        const notification = await prisma.notification.create({
            data: {
                userId: payload.userId,
                title: `Стратегия ${payload.name} закрыта!`,
                description: `На ваш счет зачислен доход в размере ${(payload.invested + payload.profit).toFixed(2)} $`,
                meta,
            },
        })
        sseEmitter.emit(AppEvents.NewNotification, payload.userId, notification)
    }

    public async sendNewStrategyNotification(payload: EventMap[AppEvents.NewStrategy]): Promise<void> {
        const meta: NotificationMeta[NotificationType.WithRedirect] = {
            type: NotificationType.WithRedirect,
            href: `/cabinet/strategies/?highlight=${payload.strategyId}`,
        }
        const notification = await prisma.notification.create({
            data: {
                userId: payload.userId,
                title: "Вам стала доступна новая стратегия!",
                description: `Стратегия: ${payload.name}. Гарантирован доход от +${payload.profitMin * 100}% до +${payload.profitMax * 100}%`,
                meta,
            },
        })
        sseEmitter.emit(AppEvents.NewNotification, payload.userId, notification)
    }

    public async sendTradeRobotClosedNotification(payload: EventMap[AppEvents.TradeRobotClosed]): Promise<void> {
        const meta: NotificationMeta[NotificationType.Info] = {
            type: NotificationType.Info,
        }
        const notification = await prisma.notification.create({
            data: {
                userId: payload.userId,
                title: `Торговый робот ${payload.name} завершил работу!`,
                description: `На ваш счет зачислен доход в размере ${(payload.invested + payload.profit).toFixed(2)} $`,
                meta,
            },
        })
        sseEmitter.emit(AppEvents.NewNotification, payload.userId, notification)
    }

    public async sendNewTradeRobotNotification(payload: EventMap[AppEvents.NewTradeRobot]): Promise<void> {
        const meta: NotificationMeta[NotificationType.WithRedirect] = {
            type: NotificationType.WithRedirect,
            href: `/cabinet/strategies/?highlight=${payload.tradeRobotId}`,
        }
        const notification = await prisma.notification.create({
            data: {
                userId: payload.userId,
                title: "Вам стал доступен новый торговый робот!",
                description: `Торговый робот: ${payload.name}. Гарантирован доход от +${payload.profitMin * 100}% до +${payload.profitMax * 100}%`,
                meta,
            },
        })
        sseEmitter.emit(AppEvents.NewNotification, payload.userId, notification)
    }
}

export const notificationsService = new NotificationsService()
