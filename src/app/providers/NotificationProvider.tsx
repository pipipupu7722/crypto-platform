"use client"

import React, { createContext, useContext } from "react"

import { notification } from "antd"
import { NotificationInstance } from "antd/es/notification/interface"

interface NotificationContextType {
    notify: NotificationInstance
    nofiticationContextHolder: React.ReactNode
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notify, nofiticationContextHolder] = notification.useNotification()

    return (
        <NotificationContext.Provider value={{ notify, nofiticationContextHolder }}>
            {nofiticationContextHolder}
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotificationContext = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error("useNotificationContext must be used within a NotificationProvider")
    }
    return context
}
