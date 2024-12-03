"use client"

import { NotificationStatus } from "@prisma/client"
import { Dropdown, Empty } from "antd"
import { MenuProps, Tag } from "antd"
import React, { PropsWithChildren, useCallback } from "react"

import { useNotifications } from "@/providers/NotificationsProvider"

export default function NotificationDropdown({ children }: PropsWithChildren) {
    const { notifications, markAsRead } = useNotifications()

    const handleHover = useCallback((id: string) => markAsRead(id), [notifications, markAsRead])

    const items: MenuProps["items"] = notifications.length
        ? notifications.map((notification) => ({
              key: notification.id,
              extra: notification.status === NotificationStatus.NEW ? <Tag color="gold">Новое</Tag> : undefined,
              onMouseEnter: () => handleHover(notification.id),
              label: (
                  <div>
                      <p style={{ fontWeight: "bold" }}>{notification.title}</p>
                      <p>{notification.description}</p>
                  </div>
              ),
          }))
        : [
              {
                  key: "none",
                  disabled: true,
                  label: (
                      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет уведомлений" />
                      </div>
                  ),
              },
          ]

    return (
        <Dropdown menu={{ items }} overlayStyle={{ minWidth: 300, maxWidth: 400, maxHeight: 300 }}>
            {children}
        </Dropdown>
    )
}
