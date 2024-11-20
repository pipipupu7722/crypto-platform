"use client"

import { redirect, usePathname } from "next/navigation"
import React, { useState } from "react"

import {
    DashboardOutlined,
    LineChartOutlined,
    LogoutOutlined,
    TransactionOutlined,
    UserOutlined,
} from "@ant-design/icons"
import { Layout, Menu, MenuProps, theme } from "antd"

import { signOut } from "@/app/actions/auth/signout"

const menuItems: MenuProps["items"] = [
    {
        key: "/dashboard",
        label: "Dashboard",
        icon: <DashboardOutlined />,
        onClick: () => redirect("/dashboard"),
    },
    {
        key: "/dashboard/transactions",
        label: "Transactions",
        icon: <TransactionOutlined />,
        onClick: () => redirect("/dashboard/transactions"),
    },
    {
        key: "/dashboard/market",
        label: "Market",
        icon: <LineChartOutlined />,
        onClick: () => redirect("/dashboard/market"),
    },
    { type: "divider" },
    {
        key: "logout",
        label: "Logout",
        icon: <LogoutOutlined />,
        onClick: () => signOut().then(() => redirect("/auth/signin")),
    },
]

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const { token } = theme.useToken()
    const pathname = usePathname()

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
                items={menuItems}
            />
        </Layout.Sider>
    )
}
