import { logger } from "./lib/server/providers/logger"
import { tokensService } from "./lib/server/services/tokens.service"
import { appconf } from "@/appconf"

export async function register() {
    if (!(globalThis as any).strategyInterval) {
        clearInterval((globalThis as any).strategyInterval)
    }

    ;(globalThis as any).strategyInterval = setInterval(async () => {
        const accessToken = await tokensService.issueServiceAccessToken()

        const result = await fetch(new URL("/api/service/calc-strategies-pnl", appconf.appHost), {
            method: "POST",
            body: JSON.stringify({ accessToken }),
        })

        if (!result.ok) {
            const { status, statusText } = result
            logger.error({ status, statusText }, "Strategy worker error")
        }
    }, appconf.strategyIntervalMs)
}
