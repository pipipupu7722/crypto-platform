"use client"

import { Notification, NotificationStatus } from "@prisma/client"
import { Dropdown, Empty, MenuProps, Tag } from "antd"
import React, { PropsWithChildren } from "react"

import { useNotifications } from "@/providers/NotificationsProvider"

export default function NotificationDropdown({ children }: PropsWithChildren) {
    const { notifications, markAsRead } = useNotifications()

    const handleHover = async (notification: Notification) => {
        if (notification.status === NotificationStatus.NEW) {
            await markAsRead(notification.id)
        }
    }

    const menu: MenuProps = {
        items: notifications.length
            ? notifications.map((notification) => ({
                  key: notification.id,
                  extra: notification.status === NotificationStatus.NEW ? <Tag color="gold">Новое</Tag> : undefined,
                  onMouseEnter: () => handleHover(notification),
                  label: (
                      <div>
                          <p style={{ marginBottom: 3, fontWeight: "bold" }}>{notification.title}</p>
                          <p style={{ marginTop: 0 }}>{notification.description}</p>
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
              ],
        style: {
            maxHeight: 600,
            marginRight: 12,
        },
    }

    return (
        <Dropdown placement="bottom" menu={menu} overlayStyle={{ minWidth: 300, maxWidth: 400 }}>
            {children}
        </Dropdown>
    )
}
