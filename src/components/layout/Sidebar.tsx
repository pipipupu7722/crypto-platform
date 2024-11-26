"use client"

import { LogoutOutlined } from "@ant-design/icons"
import { Layout, Menu, MenuProps, theme } from "antd"
import { redirect, usePathname } from "next/navigation"
import { useState } from "react"

import { logout } from "@/actions/auth/logout"

export default function Sidebar({ items }: { items: MenuProps["items"] }) {
    const [collapsed, setCollapsed] = useState(false)
    const { token } = theme.useToken()
    const pathname = usePathname()

    const allItems: MenuProps["items"] = (items ?? []).concat([
        {
            key: "logout",
            label: "Выход",
            icon: <LogoutOutlined />,
            onClick: () => logout().then(() => redirect("/auth/signin")),
        },
    ])

    return (
        <Layout.Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            style={{ background: token.colorBgContainer }}
        >
            <div
                style={{
                    height: "64px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    padding: "8px",
                }}
            >
                {collapsed ? <h1>PL</h1> : <h1>PLATFORM</h1>}
            </div>

            <Menu
                mode="inline"
                selectedKeys={[pathname]}
                style={{ height: "calc(100% - 64px)", border: 0 }}
                items={allItems}
            />
        </Layout.Sider>
    )
}
