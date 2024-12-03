"use server"

import { wrapsa } from "@/lib/server/helpers"
import { notificationsService } from "@/lib/server/services/notifications.service"

export const markNotificationAsRead = wrapsa(
    async (notificationId: string) => await notificationsService.markAsRead(notificationId)
)
