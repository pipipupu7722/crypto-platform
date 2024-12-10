"use client"

import { Alert, Button, Card, Form, Input, Space } from "antd"
import Link from "next/link"
import { redirect } from "next/navigation"
import React, { useState } from "react"

import { signIn } from "@/actions/auth/signin"
import { appconf } from "@/appconf"
import { SignInSchemaRule, SignInSchemaType } from "@/schemas/auth.schemas"

const SignIn: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSignIn = async (values: SignInSchemaType) => {
        setError(null)
        setLoading(true)
        const res = await signIn(values)
        if (res.success) {
            redirect(appconf.routes.default.user)
        } else {
            setLoading(false)
            setError(res.error)
        }
    }

    return (
        <Card title="Авторизация" style={{ maxWidth: 400, margin: "auto", textAlign: "center" }}>
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: "1rem" }} />}

            <Form
                name="basic"
                layout="vertical"
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                autoComplete="off"
                onFinish={handleSignIn}
            >
                <Form.Item<SignInSchemaType> name="email" style={{ textAlign: "left" }} rules={[SignInSchemaRule]}>
                    <Input size="large" placeholder="Email" />
                </Form.Item>

                <Form.Item<SignInSchemaType> name="password" style={{ textAlign: "left" }} rules={[SignInSchemaRule]}>
                    <Input.Password size="large" placeholder="Пароль" />
                </Form.Item>

                <Form.Item style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                    <Button style={{ width: "100%" }} size="large" type="primary" htmlType="submit" loading={loading}>
                        Зарегистрироваться
                    </Button>
                </Form.Item>

                <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
                    <Space>
                        <span>Нет аккаунта?</span>
                        <Link href="/auth/signup">Зарегистрируйтесь</Link>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default SignIn
