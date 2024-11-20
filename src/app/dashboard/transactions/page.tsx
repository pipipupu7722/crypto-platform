"use client"

import React from "react"

import { theme } from "antd"
import { Content } from "antd/es/layout/layout"

import TransactionsTable from "@/components/dashboard/TransactionsTable"
import UserTradeStats from "@/components/dashboard/UserTradeStats"

const Transactions: React.FC = () => {
    const { token } = theme.useToken()

    return (
        <Content style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
            <UserTradeStats />

            <Content
                style={{
                    margin: "24px 0",
                    padding: 24,
                    background: token.colorBgContainer,
                    borderRadius: token.borderRadiusLG,
                }}
            >
                <TransactionsTable />
            </Content>
        </Content>
    )
}

export default Transactions
