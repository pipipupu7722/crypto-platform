"use client"

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
            icon: (
                <svg height="16" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12 13.0376C12.5178 13.0376 12.9375 12.6179 12.9375 12.1001C12.9375 11.5823 12.5178 11.1626 12 11.1626C11.4822 11.1626 11.0625 11.5823 11.0625 12.1001C11.0625 12.6179 11.4822 13.0376 12 13.0376Z"
                        fill="inherit"
                    />
                    <path
                        d="M7.5 13.0376C8.01777 13.0376 8.4375 12.6179 8.4375 12.1001C8.4375 11.5823 8.01777 11.1626 7.5 11.1626C6.98223 11.1626 6.5625 11.5823 6.5625 12.1001C6.5625 12.6179 6.98223 13.0376 7.5 13.0376Z"
                        fill="inherit"
                    />
                    <path
                        d="M16.5 13.0376C17.0178 13.0376 17.4375 12.6179 17.4375 12.1001C17.4375 11.5823 17.0178 11.1626 16.5 11.1626C15.9822 11.1626 15.5625 11.5823 15.5625 12.1001C15.5625 12.6179 15.9822 13.0376 16.5 13.0376Z"
                        fill="inherit"
                    />
                    <path
                        d="M16.3453 22.2251H14.25C14.1505 22.2251 14.0552 22.1855 13.9848 22.1152C13.9145 22.0449 13.875 21.9495 13.875 21.8501V19.7547C13.8748 19.7061 13.8843 19.6578 13.9028 19.6128C13.9213 19.5677 13.9485 19.5268 13.9828 19.4922L19.6078 13.8672C19.6427 13.8318 19.6843 13.8037 19.7302 13.7845C19.776 13.7653 19.8253 13.7554 19.875 13.7554C19.9247 13.7554 19.974 13.7653 20.0198 13.7845C20.0657 13.8037 20.1073 13.8318 20.1422 13.8672L22.2328 15.9579C22.2682 15.9928 22.2964 16.0344 22.3156 16.0802C22.3348 16.1261 22.3447 16.1753 22.3447 16.2251C22.3447 16.2748 22.3348 16.324 22.3156 16.3699C22.2964 16.4158 22.2682 16.4574 22.2328 16.4922L16.6078 22.1172C16.5733 22.1516 16.5323 22.1788 16.4873 22.1973C16.4423 22.2158 16.394 22.2252 16.3453 22.2251V22.2251Z"
                        fill="none"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M20.9611 11.2639C20.8028 9.56797 20.1666 7.95179 19.1262 6.60313C18.0859 5.25446 16.6843 4.2287 15.0841 3.64502C13.484 3.06135 11.751 2.94372 10.0867 3.30583C8.42234 3.66793 6.89492 4.49488 5.6819 5.6906C4.46888 6.88632 3.62008 8.40171 3.23411 10.0607C2.84815 11.7197 2.94087 13.4541 3.5015 15.0625C4.06214 16.6708 5.06767 18.0871 6.40125 19.1467C7.73484 20.2062 9.34172 20.8656 11.0352 21.0482"
                        fill="none"
                        stroke="white"
                        stroke-width="1.7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            ),
            onClick: () => redirect(settingsUrlPath),
        },
        {
            key: "logout",
            label: "Выход",
            icon: (
                <svg height="16" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M16.3125 8.1626L20.25 12.1001L16.3125 16.0376"
                        fill="none"
                        stroke="#F7A600"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M9.75 12.1001H20.25"
                        fill="none"
                        stroke="#F7A600"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M9.75 20.3501H4.5C4.30109 20.3501 4.11032 20.2711 3.96967 20.1304C3.82902 19.9898 3.75 19.799 3.75 19.6001V4.6001C3.75 4.40119 3.82902 4.21042 3.96967 4.06977C4.11032 3.92912 4.30109 3.8501 4.5 3.8501H9.75"
                        fill="none"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            ),
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
            style={{ backgroundColor: (token as any).colorBgHeader }}
            className={css`
                .ant-layout-sider-zero-width-trigger {
                    display: none;
                }
                .ant-menu-item {
                    color: ${token.colorTextLightSolid};
                }
                .ant-menu-item-icon {
                    fill: ${token.colorPrimaryText};
                }
                .ant-menu-item-selected .ant-menu-item-icon {
                    fill: ${token.colorText};
                }
                .ant-menu-item-selected {
                    background-color: ${token.colorPrimaryText};
                    color: ${token.colorText};
                }
                .ant-layout-sider-trigger {
                    background-color: ${token.colorPrimary};
                }
                .ant-menu-item-divider {
                    background-color: #fdfdfd1f;
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
                    color: token.colorTextLightSolid,
                }}
            >
                {collapsed ? <h1>PL</h1> : <h1>{appconf.appName}</h1>}
            </div>

            <Menu
                mode="inline"
                selectedKeys={[pathname]}
                style={{
                    height: "calc(100% - 64px)",
                    border: 0,
                    backgroundColor: (token as any).colorBgSider,
                }}
                items={allItems}
            />
        </Layout.Sider>
    )
}
