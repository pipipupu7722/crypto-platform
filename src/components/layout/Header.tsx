"use client"

import { BellOutlined, SettingOutlined } from "@ant-design/icons"
import { Avatar, Button, Layout, Tooltip, theme } from "antd"
import { PropsWithChildren } from "react"

import { useSession } from "@/providers/SessionProvider"

export default function Header({ children }: PropsWithChildren) {
    const { session } = useSession()
    const { token } = theme.useToken()

    return (
        <Layout.Header
            style={{
                padding: 0,
                display: "flex",
                justifyContent: "space-around",
                backgroundColor: token.colorBgContainer,
            }}
        >
            <div
                style={{
                    padding: "0 24px",
                    width: "100%",
                    maxWidth: 1280,
                }}
            >
                <div
                    style={{
                        padding: "0 24px",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar>
                            {session.User.firstName?.substring(0, 1)?.toUpperCase() ?? "F"}
                            {session.User.lastName?.substring(0, 1)?.toUpperCase() ?? "L"}
                        </Avatar>
                        <div style={{ marginLeft: 10, display: "flex", flexDirection: "column" }}>
                            <span style={{ lineHeight: "1rem" }}>
                                {session.User.firstName} {session.User.lastName}
                            </span>
                            <span style={{ lineHeight: "1rem" }}>{session.User.email}</span>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {children}

                        <Tooltip title="Уведомления">
                            <Button type="default" shape="circle" icon={<BellOutlined />} />
                        </Tooltip>

                        <Tooltip title="Настройки">
                            <Button type="default" shape="circle" icon={<SettingOutlined />} />
                        </Tooltip>
                    </div>
                </div>
            </div>
        </Layout.Header>
    )
}
