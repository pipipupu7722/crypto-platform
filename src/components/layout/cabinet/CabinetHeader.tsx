"use client"

import { PlusOutlined } from "@ant-design/icons"
import { Button, Tooltip } from "antd"
import CountUp from "react-countup"

import Header from "../Header"
import { useSession } from "@/providers/SessionProvider"

export default function CabinetHeader() {
    const { session } = useSession()

    return (
        <Header>
            <Tooltip title="Пополнить баланс">
                <Button type="primary" shape="circle" icon={<PlusOutlined />} />
            </Tooltip>

            <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ lineHeight: "1rem" }}>Общий баланс</span>
                <strong style={{ lineHeight: "1rem" }}>
                    <CountUp end={session.User.balance} decimals={2} prefix="$ " />
                </strong>
            </div>

            <div></div>
            <div></div>
        </Header>
    )
}
