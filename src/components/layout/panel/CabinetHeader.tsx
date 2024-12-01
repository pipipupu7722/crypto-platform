"use client"

import { PlusOutlined } from "@ant-design/icons"
import { css } from "@emotion/css"
import { DepositWallet } from "@prisma/client"
import { Button, Modal, Tooltip } from "antd"
import { useState } from "react"
import CountUp from "react-countup"

import Header from "../Header"
import DepositCard from "@/components/cabinet/DepositCard"
import { useSession } from "@/providers/SessionProvider"

export default function CabinetHeader({ wallets }: { wallets: DepositWallet[] }) {
    const [isOpen, setIsOpen] = useState(false)

    const { session } = useSession()

    return (
        <>
            <Header>
                <Tooltip title="Пополнить баланс">
                    <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => setIsOpen(true)} />
                </Tooltip>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ lineHeight: "1rem" }}>Общий баланс</span>
                    <strong style={{ lineHeight: "1rem" }}>
                        <CountUp end={session.User.balance} decimals={2} prefix="$ " />
                    </strong>
                </div>

                <div></div>
            </Header>

            <Modal
                open={isOpen}
                footer={[]}
                onCancel={() => setIsOpen(false)}
                style={{ maxWidth: 400 }}
                className={css`
                    .ant-modal-content {
                        padding: 0;
                    }
                `}
            >
                <DepositCard wallets={wallets} />
            </Modal>
        </>
    )
}
