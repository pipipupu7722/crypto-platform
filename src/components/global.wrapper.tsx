"use client"

import React from "react"

import { AntdRegistry } from "@ant-design/nextjs-registry"

import { ConfigProvider, theme } from "antd"

const GlobalWrapper = (props: React.PropsWithChildren) => {
    const { children } = props

    return (
        <AntdRegistry>
            <ConfigProvider
                theme={{
                    algorithm: theme.darkAlgorithm,
                }}
            >
                {children}
            </ConfigProvider>
        </AntdRegistry>
    )
}

export { GlobalWrapper }
