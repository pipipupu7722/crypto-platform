"use server"

import { Layout } from "antd"
import { Content } from "antd/es/layout/layout"
import React, { PropsWithChildren } from "react"

import { SessionProvider } from "../../providers/SessionProvider"
import { SseProvider } from "../../providers/SseProvider"
import Loader from "@/components/layout/Loader"
import CabinetHeader from "@/components/layout/cabinet/CabinetHeader"
import CabinetSidebar from "@/components/layout/cabinet/CabinetSidebar"
import { depositWalletsService } from "@/lib/server/services/depositWallets.service"
import { getSession } from "@/lib/server/session"

export default async function CabinetLayout({ children }: PropsWithChildren) {
    const session = await getSession()

    const wallets = await depositWalletsService.getActiveByUser(session.userId)

    return (
        <SseProvider>
            <SessionProvider initialSession={session}>
                <Loader />

                <Layout style={{ minHeight: "100vh" }}>
                    <CabinetSidebar />

                    <Layout>
                        <CabinetHeader wallets={wallets} />

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
