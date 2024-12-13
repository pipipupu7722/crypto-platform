"use client"

import { Notification, NotificationStatus } from "@prisma/client"
import { createContext, useContext, useEffect, useState } from "react"

import { sseReceiver } from "./SseProvider"
import { markNotificationAsRead } from "@/actions/notification"
import { AppEvents } from "@/lib/events"

interface NotificationsContextType {
    notifications: Notification[]
    unreadCount: number
    markAsRead: (id: string) => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export const useNotifications = () => {
    const context = useContext(NotificationsContext)
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationsProvider")
    }
    return context
}

export const NotificationsProvider: React.FC<{ children: React.ReactNode; initialNotifications: Notification[] }> = ({
    children,
    initialNotifications,
}) => {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        setUnreadCount(notifications.filter((n) => n.status === NotificationStatus.NEW).length)
    }, [notifications])

    const markAsRead = async (id: string) => {
        setNotifications(
            notifications.map((notif) => (notif.id === id ? { ...notif, status: NotificationStatus.READ } : notif))
        )
        await markNotificationAsRead(id)
    }

    sseReceiver.on(AppEvents.NewNotification, (payload) => setNotifications([payload, ...notifications]))
    sseReceiver.on(AppEvents.NotificationRead, (payload) => {
        setNotifications(
            notifications.map((notif) =>
                notif.id === payload.notificationId ? { ...notif, status: NotificationStatus.READ } : notif
            )
        )
    })

    return (
        <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead }}>
            {children}
        </NotificationsContext.Provider>
    )
}
