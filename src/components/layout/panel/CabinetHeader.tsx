"use client"

import { PlusOutlined } from "@ant-design/icons"
import { css } from "@emotion/css"
import { DepositWallet } from "@prisma/client"
import { Button, Modal, Tooltip, theme } from "antd"
import { useEffect, useState } from "react"

import Header from "../Header"
import DepositCard from "@/components/cabinet/DepositCard"
import CountUpWithRef from "@/components/misc/CountUpWithRef"
import { useSession } from "@/providers/SessionProvider"

export default function CabinetHeader({ wallets }: { wallets: DepositWallet[] }) {
    const [isOpen, setIsOpen] = useState(false)
    const [totalBalance, setTotalBalance] = useState(0)

    const { token } = theme.useToken()
    const { session } = useSession()

    useEffect(() => {
        setTotalBalance(session.User.balance + session.User.tradingBalance)
    }, [session.User.balance, session.User.tradingBalance])

    return (
        <>
            <Header>
                <Tooltip title="Пополнить баланс">
                    <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => setIsOpen(true)} />
                </Tooltip>

                <div style={{ display: "flex", flexDirection: "column", color: token.colorTextLightSolid }}>
                    <span style={{ lineHeight: "1rem" }}>Общий баланс</span>
                    <strong style={{ lineHeight: "1rem" }}>
                        <CountUpWithRef end={totalBalance} decimals={2} prefix="$ " />
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
