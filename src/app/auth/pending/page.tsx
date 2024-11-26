"use server"

import { Card } from "antd"
import React from "react"

const Pending: React.FC = async () => {
    return (
        <Card title="Регистрация завершена" style={{ maxWidth: 400, margin: "auto", textAlign: "center" }}>
            Пожалуйста, ожидайте проверки ваших данных
        </Card>
    )
}

export default Pending
