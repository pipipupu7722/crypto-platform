"use client"

import { createContext, useContext, useState } from "react"

import { sseReceiver } from "./SseProvider"
import { AppEvents, UserSession } from "@/lib/types"

interface SessionContextType {
    session: UserSession
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const useSession = () => {
    const context = useContext(SessionContext)
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider")
    }
    return context
}

export const SessionProvider: React.FC<{ children: React.ReactNode; initialSession: UserSession }> = ({
    children,
    initialSession,
}) => {
    const [session, setSession] = useState<UserSession>(initialSession)

    sseReceiver.on(AppEvents.BalanceChanged, (payload) =>
        setSession({
            ...session,
            User: {
                ...session.User,
                balance: payload.balance,
            },
        })
    )

    return <SessionContext.Provider value={{ session }}>{children}</SessionContext.Provider>
}
