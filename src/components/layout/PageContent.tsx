"use client"

import { css } from "@emotion/css"
import { theme } from "antd"
import { Content } from "antd/es/layout/layout"
import { PropsWithChildren } from "react"

import PageContentWrapper from "./PageContentWrapper"
import { breakpoints } from "@/theme"

export default function PageContent({ children }: PropsWithChildren) {
    const { token } = theme.useToken()

    return (
        <PageContentWrapper>
            <Content
                className={css`
                    margin: 24px 0;
                    padding: 24px;
                    background: ${token.colorBgContainer};
                    border-radius: ${token.borderRadiusLG};

                    @media (max-width: ${breakpoints.sm}) {
                        padding: 12px;
                    }
                `}
            >
                {children}
            </Content>
        </PageContentWrapper>
    )
}
