"use client"

import mitt from "mitt"
import { PropsWithChildren, useEffect } from "react"

import { EventMap } from "@/lib/events"

export const sseReceiver = mitt<EventMap>()

export const SseProvider = ({ children }: PropsWithChildren) => {
    useEffect(() => {
        let eventSource: EventSource | null = null
        let retryTimeout: NodeJS.Timeout | null = null

        const connect = () => {
            eventSource = new EventSource("/api/events")

            eventSource.onmessage = (event) => {
                const eventData = JSON.parse(event.data)
                sseReceiver.emit(eventData.event, eventData.payload)
            }

            eventSource.onerror = () => {
                console.warn("SSE connection lost. Attempting to reconnect...")
                eventSource?.close()
                retryTimeout = setTimeout(() => connect(), 3000)
            }
        }

        connect()

        return () => {
            eventSource?.close()
            if (retryTimeout) {
                clearTimeout(retryTimeout)
            }
        }
    }, [])

    return <>{children}</>
}
