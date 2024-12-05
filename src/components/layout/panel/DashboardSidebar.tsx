"use client"

import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { UserRole } from "@prisma/client"
import { MenuProps } from "antd"
import { redirect } from "next/navigation"

import Sidebar from "../Sidebar"
import { appconf } from "@/appconf"
import { hasRole } from "@/lib/helpers"
import { useSession } from "@/providers/SessionProvider"

export default function DashboardSidebar() {
    const { session } = useSession()

    const menuItems: MenuProps["items"] = []

    if (hasRole(session.User.roles, [UserRole.ADMIN])) {
        menuItems.push({
            key: "/dashboard/managers",
            label: "Менеджеры",
            icon: <LockOutlined />,
            onClick: () => redirect("/dashboard/managers"),
        })
    }

    if (hasRole(session.User.roles, [UserRole.MANAGER])) {
        menuItems.push({
            key: "/dashboard/users",
            label: "Пользователи",
            icon: <UserOutlined />,
            onClick: () => redirect("/dashboard/users"),
        })
        menuItems.push({ type: "divider" })
    }

    if (hasRole(session.User.roles, [UserRole.USER])) {
        menuItems.push({
            key: appconf.routes.default.user,
            label: "Пользователь",
            icon: <LockOutlined />,
            onClick: () => redirect(appconf.routes.default.user),
        })
    }

    return <Sidebar items={menuItems} />
}
