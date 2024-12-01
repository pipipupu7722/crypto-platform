"use server"

import { Layout } from "antd"
import { ReactNode } from "react"

import Loader from "../Loader"
import PanelContentLayout from "./PanelContentLayout"
import { getSession } from "@/lib/server/session"
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

    return (
        <SseProvider>
            <SessionProvider initialSession={session}>
                <Loader />

                <Layout style={{ minHeight: "100vh" }}>
                    {sidebar}

                    <Layout>
                        {header}

                        <PanelContentLayout>{children}</PanelContentLayout>
                    </Layout>
                </Layout>
            </SessionProvider>
        </SseProvider>
    )
}
