"use server"

import { Layout } from "antd"
import { ReactNode } from "react"

import Loader from "../Loader"
import PanelContentLayout from "./PanelContentLayout"
import { notificationsService } from "@/lib/server/services/notifications.service"
import { getSession } from "@/lib/server/session"
import { NotificationsProvider } from "@/providers/NotificationsProvider"
import { SessionProvider } from "@/providers/SessionProvider"
import { SseProvider } from "@/providers/SseProvider"

export default async function PanelLayout({
    children,
    sidebar,
    header,
}: {
    children: ReactNode
    sidebar: ReactNode
    header: ReactNode
}) {
    const session = await getSession()
    const notifications = await notificationsService.getAllByUser(session.userId)

    return (
        <SseProvider>
            <SessionProvider initialSession={session}>
                <NotificationsProvider initialNotifications={notifications}>
                    <Loader />

                    <Layout style={{ minHeight: "100vh" }}>
                        {sidebar}

                        <Layout>
                            {header}

                            <PanelContentLayout>{children}</PanelContentLayout>
                        </Layout>
                    </Layout>
                </NotificationsProvider>
            </SessionProvider>
        </SseProvider>
    )
}
