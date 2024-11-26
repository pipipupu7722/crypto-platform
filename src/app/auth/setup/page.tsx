"use client"

import { Alert, Button, Card, Form, Input } from "antd"
import PhoneInput from "antd-phone-input"
import { redirect } from "next/navigation"
import React, { useState } from "react"

import { setupProfile } from "@/actions/auth/setupProfile"
import { ProfileSetupSchemaRule, ProfileSetupSchemaType } from "@/schemas/auth.schemas"

const Setup: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleFirstLogin = async (values: ProfileSetupSchemaType) => {
        setError(null)
        setLoading(true)
        const res = await setupProfile(values)
        if (res.success) {
            redirect("/cabinet")
        } else {
            setLoading(false)
            setError(res.error)
        }
    }

    return (
        <Card title="Дополнительные данные" style={{ maxWidth: 400, margin: "auto", textAlign: "center" }}>
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: "1rem" }} />}

            <Form
                name="basic"
                layout="vertical"
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                autoComplete="off"
                onFinish={handleFirstLogin}
            >
                <Form.Item<ProfileSetupSchemaType>
                    name="firstName"
                    style={{ textAlign: "left" }}
                    rules={[ProfileSetupSchemaRule]}
                >
                    <Input size="large" placeholder="Имя" />
                </Form.Item>

                <Form.Item<ProfileSetupSchemaType>
                    name="lastName"
                    style={{ textAlign: "left" }}
                    rules={[ProfileSetupSchemaRule]}
                >
                    <Input size="large" placeholder="Фамилия" />
                </Form.Item>

                <Form.Item<ProfileSetupSchemaType>
                    name="phone"
                    style={{ textAlign: "left" }}
                    rules={[
                        {
                            validator: (_, { valid }) => {
                                if (valid(true)) return Promise.resolve()
                                return Promise.reject("Неправильный номер")
                            },
                        },
                    ]}
                >
                    <PhoneInput size="large" />
                </Form.Item>

                <Form.Item style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                    <Button style={{ width: "100%" }} size="large" type="primary" htmlType="submit" loading={loading}>
                        Продолжить
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default Setup
