"use client"

import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider, theme } from "antd"
import { PropsWithChildren } from "react"

const AntdProvider = (props: PropsWithChildren) => {
    const { children } = props

    return (
        <AntdRegistry>
            <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
                <>{children}</>
            </ConfigProvider>
        </AntdRegistry>
    )
}

export { AntdProvider }
