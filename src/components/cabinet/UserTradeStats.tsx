"use client"

import { css } from "@emotion/css"
import { Card, Col, Row, Statistic, StatisticProps } from "antd"
import { FC, useEffect, useRef } from "react"

import CountUpWithRef from "../misc/CountUpWithRef"
import { useSession } from "@/providers/SessionProvider"
import { breakpoints } from "@/theme"

const formatter: StatisticProps["formatter"] = (value) => (
    <CountUpWithRef style={{ fontWeight: "bold" }} end={value as number} decimals={2} prefix="$ " />
)

const UserTradeStats: FC = () => {
    const { session } = useSession()

    const prevUser = useRef(session.User)
    useEffect(() => {
        prevUser.current = session.User
    }, [session.User])

    return (
        <>
            <Row
                gutter={{ xs: 8, sm: 8, md: 16 }}
                className={css`
                    @media (max-width: ${breakpoints.sm}) {
                        display: none;
                    }
                `}
            >
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
                        <Statistic
                            title="Выведенные средства"
                            formatter={formatter}
                            value={session.User.withdrawnFunds}
                        />
                    </Card>
                </Col>
            </Row>

            <Row
                gutter={{ xs: 8, sm: 8, md: 16 }}
                className={css`
                    @media (min-width: ${breakpoints.sm}) {
                        display: none;
                    }
                `}
            >
                <Col span={12}>
                    <Card bordered={false}>
                        <Statistic title="Общий баланс" formatter={formatter} value={session.User.balance} />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card bordered={false}>
                        <Statistic title="Торговый счет" formatter={formatter} value={session.User.tradingBalance} />
                    </Card>
                </Col>
            </Row>

            <Row
                gutter={{ xs: 8, sm: 8, md: 16 }}
                className={css`
                    margin-top: 8px;

                    @media (min-width: ${breakpoints.sm}) {
                        display: none;
                    }
                `}
            >
                <Col span={24}>
                    <Card bordered={false}>
                        <Statistic
                            title="Выведенные средства"
                            formatter={formatter}
                            value={session.User.withdrawnFunds}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default UserTradeStats
