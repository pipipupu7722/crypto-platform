"use client"

import { Alert, Button, Card, Form, Input, Space } from "antd"
import Link from "next/link"
import { redirect } from "next/navigation"
import React, { useState } from "react"

import { signUp } from "@/actions/auth/signup"
import { SignUpSchemaRule, SignUpSchemaType } from "@/schemas/auth.schemas"

const SignUp: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSignUp = async (values: SignUpSchemaType) => {
        setError(null)
        setLoading(true)
        const res = await signUp(values)
        if (res.success) {
            redirect("/auth/setup")
        } else {
            setLoading(false)
            setError(res.error)
        }
    }

    return (
        <Card title="Регистрация" style={{ maxWidth: 400, margin: "auto", textAlign: "center" }}>
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: "1rem" }} />}

            <Form
                name="basic"
                layout="vertical"
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                autoComplete="off"
                onFinish={handleSignUp}
            >
                <Form.Item<SignUpSchemaType> name="username" style={{ textAlign: "left" }} rules={[SignUpSchemaRule]}>
                    <Input size="large" placeholder="Имя пользователя" />
                </Form.Item>

                <Form.Item<SignUpSchemaType> name="email" style={{ textAlign: "left" }} rules={[SignUpSchemaRule]}>
                    <Input size="large" placeholder="Email" />
                </Form.Item>

                <Form.Item<SignUpSchemaType> name="password" style={{ textAlign: "left" }} rules={[SignUpSchemaRule]}>
                    <Input.Password size="large" placeholder="Пароль" />
                </Form.Item>

                <Form.Item<SignUpSchemaType>
                    name="confirmPassword"
                    style={{ textAlign: "left" }}
                    rules={[
                        SignUpSchemaRule,
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve()
                                }
                                return Promise.reject(new Error("Пароли не совпадают"))
                            },
                        }),
                    ]}
                >
                    <Input.Password size="large" placeholder="Подтверждение пароля" />
                </Form.Item>

                <Form.Item style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                    <Button
                        style={{ width: "100%", fontWeight: "bold" }}
                        size="large"
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Зарегистрироваться
                    </Button>
                </Form.Item>

                <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
                    <Space>
                        <span>Уже есть аккаунт?</span>
                        <Link style={{ textDecoration: "underline" }} href="/auth/signin">
                            Войти
                        </Link>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default SignUp
