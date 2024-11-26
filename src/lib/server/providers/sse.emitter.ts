import { NextRequest, NextResponse } from "next/server"
import "server-only"

import { AppEvents } from "../../types"
import { getSessionPayload } from "../session"
import { logger } from "./logger"
import { redis } from "./redis"

class SseEmitter {
    private activeConnections: Map<string, Set<WritableStreamDefaultWriter>> = new Map()

    constructor() {
        redis.subscriber.subscribe("sse-events", (message) => {
            const { userId, event, payload } = JSON.parse(message)
            this.broadcast(event, userId, payload)
        })
    }

    public async emit(event: AppEvents, userId: string, payload: any): Promise<void> {
        const message = JSON.stringify({ userId, event, payload })
        await redis.publisher.publish("sse-events", message)
        logger.debug({ event, userId, payload }, `SSE emit [uid:${userId}]`)
    }

    public async connect(request: NextRequest): Promise<NextResponse> {
        const { readable, writable } = new TransformStream()
        const userId = (await getSessionPayload()).uid
        const writer = writable.getWriter()

        if (!this.activeConnections.has(userId)) {
            this.activeConnections.set(userId, new Set([writer]))
        } else {
            this.activeConnections.get(userId)?.add(writer)
        }
        logger.info(`SSE Client connected [uid:${userId}]`)

        request.signal.addEventListener("abort", () => this.disconnect(userId, writer))

        return new NextResponse(readable, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        })
    }

    private async broadcast(event: AppEvents, userId: string, payload: any): Promise<void> {
        const clients = this.activeConnections.get(userId)
        if (!clients) return

        const payloadString = JSON.stringify({ event, payload })

        logger.debug(payload, `SSE broadcast [uid:${userId}]`)
        clients.forEach((client) => client.write(new TextEncoder().encode(`data: ${payloadString}\n\n`)))
    }

    private disconnect(userId: string, writer: WritableStreamDefaultWriter): void {
        logger.info(`SSE Client disconnected [uid:${userId}]`)
        this.activeConnections.get(userId)?.delete(writer)
        if (this.activeConnections.get(userId)?.size === 0) {
            this.activeConnections.delete(userId)
        }
    }
}

const sseEmitter = new SseEmitter()

export { sseEmitter }
