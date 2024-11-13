"use server"

import React from "react"

import { Card } from "antd"

const Pending: React.FC = async () => {
    return (
        <Card title="Pending" style={{ maxWidth: 400, margin: "auto", textAlign: "center" }}>
            Please wait until our managers approve your registration request
        </Card>
    )
}

export default Pending
