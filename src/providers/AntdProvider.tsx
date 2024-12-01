"use client"

import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider } from "antd"
import { PropsWithChildren } from "react"

import { themeConfig } from "@/theme"

const AntdProvider = (props: PropsWithChildren) => {
    const { children } = props

    return (
        <AntdRegistry>
            <ConfigProvider theme={themeConfig}>
                <>{children}</>
            </ConfigProvider>
        </AntdRegistry>
    )
}

export { AntdProvider }
