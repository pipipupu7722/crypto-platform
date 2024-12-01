"use client"

import { css } from "@emotion/css"
import { Layout } from "antd"
import { Content } from "antd/es/layout/layout"
import { ReactNode } from "react"

import { breakpoints } from "@/theme"

export default function PanelContentLayout({ children }: { children: ReactNode }) {
    return (
        <Layout
            className={css`
                padding: 0 24px;
                display: flex;
                flex-direction: row;
                justify-content: space-around;

                @media (max-width: ${breakpoints.md}) {
                    padding: 0;
                }
            `}
        >
            <Content
                className={css`
                    margin: 0;
                    padding: 24px;
                    max-width: 1280px;

                    @media (max-width: ${breakpoints.sm}) {
                        padding: 12px;
                    }
                `}
            >
                {children}
            </Content>
        </Layout>
    )
}
