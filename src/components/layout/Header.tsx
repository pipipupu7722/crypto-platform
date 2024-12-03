"use client"

import { BellOutlined, SettingOutlined } from "@ant-design/icons"
import { css } from "@emotion/css"
import { Avatar, Badge, Button, Layout, Tooltip, theme } from "antd"
import { redirect } from "next/navigation"
import { PropsWithChildren } from "react"

import NotificationDropdown from "../NotificationDropdown"
import { useNotifications } from "@/providers/NotificationsProvider"
import { useSession } from "@/providers/SessionProvider"
import { breakpoints } from "@/theme"

export default function Header({ children }: PropsWithChildren) {
    const { session } = useSession()
    const { unreadCount } = useNotifications()

    const { token } = theme.useToken()

    return (
        <Layout.Header
            className={css`
                padding: 0;
                display: flex;
                justify-content: space-around;
                background-color: ${token.colorBgContainer};
            `}
        >
            <div
                className={css`
                    padding: 0 24px;
                    width: 100%;
                    max-width: 1280px;

                    @media (max-width: ${breakpoints.sm}) {
                        padding: 0 12px;
                    }
                `}
            >
                <div
                    className={css`
                        padding: 0 24px;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;

                        @media (max-width: ${breakpoints.sm}) {
                            padding: 0;
                        }
                    `}
                >
                    <div
                        className={css`
                            display: flex;
                            align-items: center;

                            @media (max-width: ${breakpoints.sm}) {
                                display: none;
                            }
                        `}
                    >
                        <Avatar>
                            {session.User.firstName?.substring(0, 1)?.toUpperCase() ?? "F"}
                            {session.User.lastName?.substring(0, 1)?.toUpperCase() ?? "L"}
                        </Avatar>

                        <div
                            className={css`
                                margin-left: 10px;
                                display: flex;
                                flex-direction: column;

                                @media (max-width: ${breakpoints.sm}) {
                                    display: none;
                                }
                            `}
                        >
                            <span style={{ lineHeight: "1rem" }}>
                                {session.User.firstName} {session.User.lastName}
                            </span>
                            <span style={{ lineHeight: "1rem" }}>{session.User.email}</span>
                        </div>
                    </div>

                    <div
                        className={css`
                            gap: 8px;
                            display: none;
                            align-items: center;

                            @media (max-width: ${breakpoints.sm}) {
                                display: flex;
                            }
                        `}
                    >
                        {children}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div
                            className={css`
                                gap: 8px;
                                display: flex;
                                align-items: center;

                                @media (max-width: ${breakpoints.sm}) {
                                    display: none;
                                }
                            `}
                        >
                            {children}
                        </div>

                        <NotificationDropdown>
                            <Badge count={unreadCount} overflowCount={9} style={{ zIndex: 999 }}>
                                <Button type="default" shape="circle" icon={<BellOutlined />} />
                            </Badge>
                        </NotificationDropdown>

                        <Tooltip title="Настройки">
                            <Button
                                type="default"
                                shape="circle"
                                icon={<SettingOutlined />}
                                onClick={() => redirect("/cabinet/settings")}
                            />
                        </Tooltip>
                    </div>
                </div>
            </div>
        </Layout.Header>
    )
}
