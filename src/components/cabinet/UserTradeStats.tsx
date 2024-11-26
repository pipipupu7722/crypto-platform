"use client"

import { Card, Col, Row, Statistic, StatisticProps, theme } from "antd"
import { FC } from "react"
import CountUp from "react-countup"

import { useSession } from "@/providers/SessionProvider"

const formatter: StatisticProps["formatter"] = (value) => <CountUp end={value as number} decimals={2} prefix="$ " />

const UserTradeStats: FC = () => {
    const { session } = useSession()

    return (
        <Row gutter={16}>
            <Col span={8}>
                <Card bordered={false}>
                    <Statistic title="Общий баланс" formatter={formatter} value={session.User.balance} />
                </Card>
            </Col>

            <Col span={8}>
                <Card bordered={false}>
                    <Statistic title="Торговый счет" formatter={formatter} value={session.User.tradingBalance} />
                </Card>
            </Col>

            <Col span={8}>
                <Card bordered={false}>
                    <Statistic title="Выведенные средства" formatter={formatter} value={session.User.withdrawnFunds} />
                </Card>
            </Col>
        </Row>
    )
}

export default UserTradeStats
