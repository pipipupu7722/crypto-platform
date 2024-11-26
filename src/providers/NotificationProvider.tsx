"use client"

import { notification } from "antd"
import { NotificationInstance } from "antd/es/notification/interface"
import { createContext, useContext } from "react"

interface NotificationContextType {
    notify: NotificationInstance
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export const useNotify = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error("useNotificationContext must be used within a NotificationProvider")
    }
    return context
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notify, contextHolder] = notification.useNotification()

    return (
        <NotificationContext.Provider value={{ notify }}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    )
}
