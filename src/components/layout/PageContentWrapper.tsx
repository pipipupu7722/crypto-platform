"use client"

import { Content } from "antd/es/layout/layout"
import { PropsWithChildren } from "react"

export default function PageContentWrapper({ children }: PropsWithChildren) {
    return <Content style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>{children}</Content>
}
