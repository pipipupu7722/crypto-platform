import mitt from "mitt"
import "server-only"

import { logger } from "./logger"
import { sseEmitter } from "./sse.emitter"
import { AppEvents, EventMap } from "@/lib/types"

export const eventEmitter = mitt<EventMap>()

eventEmitter.on("*", (event, payload) => logger.debug(`Event "${event}" fired with ${JSON.stringify(payload)}`))

eventEmitter.on(AppEvents.BalanceChanged, (event) => sseEmitter.emit(AppEvents.BalanceChanged, event.userId, event))
eventEmitter.on(AppEvents.StrategiesPnlUpdated, (event) =>
    sseEmitter.emit(AppEvents.StrategiesPnlUpdated, event.userId, event)
)
