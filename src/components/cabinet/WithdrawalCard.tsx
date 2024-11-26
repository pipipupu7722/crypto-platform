"use client"

import { DepositWallet } from "@prisma/client"
import { Card, Form, QRCode, Select } from "antd"
import { useState } from "react"

import ClickToCopy from "../misc/ClickToCopy"

export default function WithdrawalCard() {
    return <Card title="Вывод средств" bordered={true} style={{ marginLeft: 10, minWidth: 350 }}></Card>
}
