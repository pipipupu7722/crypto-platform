"use client"

import Link from "next/link"
import { redirect } from "next/navigation"
import React, { useState } from "react"
import { useFormStatus } from "react-dom"

import { Alert, Button, Card, Form, Input, Space } from "antd"

import { signUp } from "@/app/actions/auth/signup"
import { SignUpSchemaRule, SignUpSchemaType } from "@/schemas/auth.schemas"

const SignUp: React.FC = () => {
    const { pending } = useFormStatus()
    const [error, setError] = useState<string | null>(null)

    const handleSignUp = async (values: SignUpSchemaType) => {
        setError(null)
        const res = await signUp(values)
        if (res.error) {
            setError(res.error)
        } else {
            redirect("/auth/setup")
        }
    }

    return (
        <Card title="Sign Up" style={{ maxWidth: 400, margin: "auto", textAlign: "center" }}>
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
                    <Input size="large" placeholder="Username" />
                </Form.Item>

                <Form.Item<SignUpSchemaType> name="email" style={{ textAlign: "left" }} rules={[SignUpSchemaRule]}>
                    <Input size="large" placeholder="Email" />
                </Form.Item>

                <Form.Item<SignUpSchemaType> name="password" style={{ textAlign: "left" }} rules={[SignUpSchemaRule]}>
                    <Input.Password size="large" placeholder="Password" />
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
                                return Promise.reject(new Error("Passwords don't match"))
                            },
                        }),
                    ]}
                >
                    <Input.Password size="large" placeholder="Confirm password" />
                </Form.Item>

                <Form.Item style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                    <Button style={{ width: "100%" }} size="large" type="primary" htmlType="submit" loading={pending}>
                        Sign Up
                    </Button>
                </Form.Item>

                <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
                    <Space>
                        <span>Already have an account?</span>
                        <Link href="/auth/signin">Sign In</Link>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default SignUp
