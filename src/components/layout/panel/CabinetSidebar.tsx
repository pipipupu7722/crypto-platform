"use client"

import { BarChartOutlined, LockOutlined, TransactionOutlined } from "@ant-design/icons"
import { UserRole } from "@prisma/client"
import { MenuProps } from "antd"
import { redirect } from "next/navigation"

import Sidebar from "../Sidebar"
import { hasRole } from "@/lib/helpers"
import { useSession } from "@/providers/SessionProvider"

export default function CabinetSidebar() {
    const { session } = useSession()

    const menuItems: MenuProps["items"] = [
        {
            key: "/cabinet",
            label: "Баланс",
            icon: <TransactionOutlined />,
            onClick: () => redirect("/cabinet"),
        },
        // {
        //     key: "/cabinet/transactions",
        //     label: "Транзакции",
        //     icon: <LineChartOutlined />,
        //     onClick: () => redirect("/cabinet/transactions"),
        // },
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
            key: "/dashboard",
            label: "Менеджер",
            icon: <LockOutlined />,
            onClick: () => redirect("/dashboard"),
        })
    }

    return <Sidebar items={menuItems} />
}
