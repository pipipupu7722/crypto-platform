"use client"

import { BarChartOutlined, LineChartOutlined, LockOutlined, TransactionOutlined } from "@ant-design/icons"
import { UserRole } from "@prisma/client"
import { MenuProps } from "antd"
import { redirect } from "next/navigation"

import Sidebar from "../Sidebar"
import { appconf } from "@/appconf"
import { hasRole } from "@/lib/helpers"
import { useSession } from "@/providers/SessionProvider"

export default function CabinetSidebar() {
    const { session } = useSession()

    const menuItems: MenuProps["items"] = [
        {
            key: "/cabinet/strategies",
            label: "Стратегии",
            icon: <LineChartOutlined />,
            onClick: () => redirect("/cabinet/strategies"),
        },
        {
            key: "/cabinet",
            label: "Баланс",
            icon: <TransactionOutlined />,
            onClick: () => redirect("/cabinet"),
        },
        {
            key: "/cabinet/market",
            label: "Онлайн-рынок",
            icon: <BarChartOutlined />,
            onClick: () => redirect("/cabinet/market"),
        },
        { type: "divider" },
    ]

    if (hasRole(session.User.roles, [UserRole.ADMIN, UserRole.MANAGER])) {
        menuItems.push({
            key: appconf.routes.default.admin,
            label: "Менеджер",
            icon: <LockOutlined />,
            onClick: () => redirect(appconf.routes.default.admin),
        })
    }

    return <Sidebar items={menuItems} />
}
