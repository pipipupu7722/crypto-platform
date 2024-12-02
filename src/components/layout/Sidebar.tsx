"use client"

import { LogoutOutlined, SettingOutlined } from "@ant-design/icons"
import { css } from "@emotion/css"
import { UserRole } from "@prisma/client"
import { Layout, Menu, MenuProps, theme } from "antd"
import { redirect, usePathname } from "next/navigation"
import { useState } from "react"

import { logout } from "@/actions/auth/logout"
import { appconf } from "@/appconf"
import { hasRole } from "@/lib/helpers"
import { useSession } from "@/providers/SessionProvider"

export default function Sidebar({ items }: { items: MenuProps["items"] }) {
    const [collapsed, setCollapsed] = useState(false)
    const { token } = theme.useToken()
    const { session } = useSession()
    const pathname = usePathname()

    const settingsUrlPath = hasRole(session.User.roles, [UserRole.USER]) ? "/cabinet/settings" : "/dashboard/settings"

    const allItems: MenuProps["items"] = (items ?? []).concat([
        {
            key: settingsUrlPath,
            label: "Настройки",
            icon: <SettingOutlined />,
            onClick: () => redirect(settingsUrlPath),
        },
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
            breakpoint="xl"
            collapsedWidth={50}
            collapsed={collapsed}
            onCollapse={setCollapsed}
            onBreakpoint={setCollapsed}
            style={{ background: token.colorBgContainer }}
            className={css`
                .ant-layout-sider-zero-width-trigger {
                    display: none;
                }
            `}
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
                {collapsed ? <h1>PL</h1> : <h1>{appconf.appName}</h1>}
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
