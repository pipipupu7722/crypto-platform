"use client"

import { DepositWallet } from "@prisma/client"
import { Card, Form, QRCode, Select } from "antd"
import { useState } from "react"

import ClickToCopy from "../misc/ClickToCopy"

export default function DepositCard({ wallets }: { wallets: DepositWallet[] }) {
    const [wallet, setWallet] = useState<DepositWallet | undefined>(undefined)

    return (
        <Card title="Пополнение счета" bordered={true} style={{ minWidth: 350 }}>
            <Form.Item>
                <Select
                    placeholder="Выберите актив"
                    onChange={(value) => setWallet(wallets.find((wallet) => wallet.crypto === value))}
                >
                    {wallets.map((wallet) => (
                        <Select.Option value={wallet.crypto}>{wallet.crypto}</Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <h3>
                    <ClickToCopy>{wallet?.wallet ?? "N/A"}</ClickToCopy>
                </h3>
                <QRCode
                    value={wallet?.wallet ?? "N/A"}
                    status={wallet ? "active" : "scanned"}
                    statusRender={() => "N/A"}
                />
            </div>

            <p style={{ textAlign: "center" }}>Для пополнения счета совершите транзакцию на указанный кошелек</p>
        </Card>
    )
}
