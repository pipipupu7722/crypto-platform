import "server-only"

import { appconf } from "@/appconf"

let logger: any

if (appconf.runtime === "edge") {
    const pino = require("pino")
    logger = pino()
} else {
    const pino = require("pino")
    const PinoPretty = require("pino-pretty")

    logger = pino(
        PinoPretty({
            colorize: true,
            ignore: "hostname,pid",
            translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
        })
    )
}

export { logger }
