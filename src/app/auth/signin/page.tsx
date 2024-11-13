"use client"

import Link from "next/link"
import { redirect } from "next/navigation"
import React, { useState } from "react"

import { Alert, Button, Card, Form, Input, Space } from "antd"

import { signIn } from "@/app/actions/auth/signin"
import { SignInSchemaRule, SignInSchemaType } from "@/schemas/auth.schemas"

const SignIn: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSignIn = async (values: SignInSchemaType) => {
        setError(null)
        const res = await signIn(values)
        if (res.error) {
            setError(res.error)
        } else {
            redirect("/dashboard")
        }
    }

    return (
        <Card title="Sign In" style={{ maxWidth: 400, margin: "auto", textAlign: "center" }}>
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
                    <Input.Password size="large" placeholder="Password" />
                </Form.Item>

                <Form.Item style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                    <Button style={{ width: "100%" }} size="large" type="primary" htmlType="submit" loading={loading}>
                        Sign In
                    </Button>
                </Form.Item>

                <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
                    <Space>
                        <span>Don&apos;t have an account?</span>
                        <Link href="/auth/signup">Sign Up</Link>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default SignIn
