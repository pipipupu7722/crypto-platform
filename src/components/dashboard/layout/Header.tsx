"use client"

import React from "react"

import { BellOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons"
import { Avatar, Button, Layout, Tooltip, theme } from "antd"

import { UserSession } from "@/lib/types"

export default function Header({ session }: { session: UserSession }) {
    const { token } = theme.useToken()

    return (
        <Layout.Header
            style={{
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
                            {session.user.firstName?.substring(0, 1)?.toUpperCase() ?? "F"}
                            {session.user.lastName?.substring(0, 1)?.toUpperCase() ?? "L"}
                        </Avatar>
                        <div style={{ marginLeft: 10, display: "flex", flexDirection: "column" }}>
                            <span style={{ lineHeight: "1rem" }}>
                                {session.user.firstName} {session.user.lastName}
                            </span>
                            <span style={{ lineHeight: "1rem" }}>{session.user.email}</span>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Tooltip title="Пополнить баланс">
                            <Button type="primary" shape="circle" icon={<PlusOutlined />} />
                        </Tooltip>

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ lineHeight: "1rem" }}>Общий баланс</span>
                            <strong style={{ lineHeight: "1rem" }}>$ 1937.00</strong>
                        </div>

                        <div></div>
                        <div></div>

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
