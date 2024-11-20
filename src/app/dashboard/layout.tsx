import React, { PropsWithChildren } from "react"

import { Layout } from "antd"
import { Content } from "antd/es/layout/layout"

import Header from "@/components/dashboard/layout/Header"
import Loader from "@/components/dashboard/layout/Loader"
import Sidebar from "@/components/dashboard/layout/Sidebar"
import { getSession } from "@/lib/server/session"

export default async function DashboardLayout({ children }: PropsWithChildren) {
    const session = await getSession()

    return (
        <>
            <Loader />

            <Layout style={{ minHeight: "100vh" }}>
                <Sidebar />

                <Layout>
                    <Header session={session} />

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
        </>
    )
}
