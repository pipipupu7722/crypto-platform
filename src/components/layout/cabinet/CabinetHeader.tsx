"use client"

import { PlusOutlined } from "@ant-design/icons"
import { DepositWallet } from "@prisma/client"
import { Button, Modal, Tooltip } from "antd"
import { useEffect, useState } from "react"
import CountUp from "react-countup"

import Header from "../Header"
import DepositCard from "@/components/cabinet/DepositCard"
import { useSession } from "@/providers/SessionProvider"

export default function CabinetHeader({ wallets }: { wallets: DepositWallet[] }) {
    const [isOpen, setIsOpen] = useState(false)

    const { session } = useSession()

    useEffect(() => {
        const style = document.createElement("style")
        style.textContent = ".deposit-card-modal .ant-modal-content { padding: 0 }"
        document.head.appendChild(style)
    }, [])

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
                <div></div>
            </Header>

            <Modal
                open={isOpen}
                footer={[]}
                className="deposit-card-modal"
                onCancel={() => setIsOpen(false)}
                style={{ maxWidth: 400 }}
            >
                <DepositCard wallets={wallets} />
            </Modal>
        </>
    )
}
