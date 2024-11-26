import { createClient } from "redis"

import { logger } from "./logger"
import { appconf } from "@/appconf"

const redis = {
    publisher: createClient({ url: appconf.redisUrl }),
    subscriber: createClient({ url: appconf.redisUrl }),
}

redis.publisher.connect().catch((error) => logger.error(error, "Redis.publisher connection failed"))
redis.publisher.on("error", (error) => (appconf.isBuilding ? null : logger.error(error, "Redis.publisher error")))

redis.subscriber.connect().catch((error) => logger.error(error, "Redis.subscriber connection failed"))
redis.subscriber.on("error", (error) => (appconf.isBuilding ? null : logger.error(error, "Redis.subscriber error")))

export { redis }
