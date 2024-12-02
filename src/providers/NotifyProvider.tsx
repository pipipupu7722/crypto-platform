"use client"

import { notification } from "antd"
import { NotificationInstance } from "antd/es/notification/interface"
import { createContext, useContext } from "react"

interface NotifyContextType {
    notify: NotificationInstance
}

const NotifyContext = createContext<NotifyContextType | null>(null)

export const useNotify = () => {
    const context = useContext(NotifyContext)
    if (!context) {
        throw new Error("useNotifyContext must be used within a NotifyProvider")
    }
    return context
}

export const NotifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notify, contextHolder] = notification.useNotification()

    return (
        <NotifyContext.Provider value={{ notify }}>
            {contextHolder}
            {children}
        </NotifyContext.Provider>
    )
}
