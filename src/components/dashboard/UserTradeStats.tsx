"use client"

import React from "react"

import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons"
import { Card, Col, Row, Statistic, theme } from "antd"

const UserTradeStats: React.FC = () => {
    const { token } = theme.useToken()

    return (
        <Row gutter={16}>
            <Col span={8}>
                <Card bordered={false}>
                    <Statistic title="Общий баланс" value={100000.28} precision={2} suffix="$" />
                </Card>
            </Col>

            <Col span={8}>
                <Card bordered={false}>
                    <Statistic
                        title="Торговый счет"
                        value={11.28}
                        precision={2}
                        valueStyle={{ color: token.colorSuccessText }}
                        prefix={<ArrowUpOutlined />}
                        suffix="%"
                    />
                </Card>
            </Col>

            <Col span={8}>
                <Card bordered={false}>
                    <Statistic
                        title="Выведенные средства"
                        value={9.3}
                        precision={2}
                        valueStyle={{ color: token.colorErrorText }}
                        prefix={<ArrowDownOutlined />}
                        suffix="%"
                    />
                </Card>
            </Col>
        </Row>
    )
}

export default UserTradeStats
