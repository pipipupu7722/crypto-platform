import mitt from "mitt"
import "server-only"

import { AppEvents, EventMap } from "../../types"
import { logger } from "./logger"
import { sseEmitter } from "./sse.emitter"

export const eventEmitter = mitt<EventMap>()

eventEmitter.on("*", (event, payload) => logger.debug(`Event "${event}" fired with ${JSON.stringify(payload)}`))

eventEmitter.on(AppEvents.BalanceChanged, (event) => sseEmitter.emit(AppEvents.BalanceChanged, event.userId, event))
