import mitt from "mitt"
import "server-only"

import { notificationsService } from "../services/notifications.service"
import { logger } from "./logger"
import { sseEmitter } from "./sse.emitter"
import { AppEvents, EventMap } from "@/lib/events"

export const eventEmitter = mitt<EventMap>()

eventEmitter.on("*", (event, payload) => logger.debug(`Event "${event}" fired with ${JSON.stringify(payload)}`))

eventEmitter.on(AppEvents.BalanceChanged, (event) => sseEmitter.emit(AppEvents.BalanceChanged, event.userId, event))
eventEmitter.on(AppEvents.StrategiesRecalculated, (event) =>
    sseEmitter.emit(AppEvents.StrategiesRecalculated, event.userId, event)
)
eventEmitter.on(AppEvents.TradeRobotsRecalculated, (event) =>
    sseEmitter.emit(AppEvents.TradeRobotsRecalculated, event.userId, event)
)

eventEmitter.on(AppEvents.NewStrategy, (payload) => notificationsService.sendNewStrategyNotification(payload))
eventEmitter.on(AppEvents.StrategyClosed, (payload) => notificationsService.sendStrategyClosedNotification(payload))

eventEmitter.on(AppEvents.NewTradeRobot, (payload) => notificationsService.sendNewTradeRobotNotification(payload))
eventEmitter.on(AppEvents.TradeRobotClosed, (payload) => notificationsService.sendTradeRobotClosedNotification(payload))

eventEmitter.on(AppEvents.TransactionConfirmed, (payload) =>
    notificationsService.sendTransactionConfirmedNotification(payload)
)
