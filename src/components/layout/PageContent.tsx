"use client"

import { theme } from "antd"
import { Content } from "antd/es/layout/layout"
import { PropsWithChildren } from "react"

export default function PageContent({ children }: PropsWithChildren) {
    const { token } = theme.useToken()

    return (
        <Content style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
            <Content
                style={{
                    margin: "24px 0",
                    padding: 24,
                    background: token.colorBgContainer,
                    borderRadius: token.borderRadiusLG,
                }}
            >
                {children}
            </Content>
        </Content>
    )
}
