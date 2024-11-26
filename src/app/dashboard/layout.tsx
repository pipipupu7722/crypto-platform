"use server"

import { Layout } from "antd"
import { Content } from "antd/es/layout/layout"
import { PropsWithChildren } from "react"

import { SessionProvider } from "../../providers/SessionProvider"
import { SseProvider } from "../../providers/SseProvider"
import Header from "@/components/layout/Header"
import Loader from "@/components/layout/Loader"
import DashboardSidebar from "@/components/layout/dashboard/DashboardSidebar"
import { getSession } from "@/lib/server/session"

export default async function DashboardLayout({ children }: PropsWithChildren) {
    const session = await getSession()

    return (
        <SseProvider>
            <SessionProvider initialSession={session}>
                <Loader />

                <Layout style={{ minHeight: "100vh" }}>
                    <DashboardSidebar />

                    <Layout>
                        <Header />

                        <Layout
                            style={{
                                padding: "0 24px",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-around",
                            }}
                        >
                            <Content
                                style={{
                                    margin: 0,
                                    padding: 24,
                                    maxWidth: 1280,
                                }}
                            >
                                {children}
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>
            </SessionProvider>
        </SseProvider>
    )
}
