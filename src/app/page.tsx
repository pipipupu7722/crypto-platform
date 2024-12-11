"use client"

import { Button, Typography, theme } from "antd"
import React from "react"

import { appconf } from "@/appconf"
import HomeLayout from "@/components/layout/HomeLayout"

const { Title, Text, Link } = Typography

const WelcomePage = () => {
    const { token } = theme.useToken()

    return (
        <HomeLayout>
            <Title level={2} style={{ fontWeight: "bold" }}>
                Добро пожаловать в {appconf.appName}
            </Title>
            <Text style={{ fontSize: "16px", lineHeight: "1.6" }}>
                Создавая аккаунт, вы соглашаетесь с нашими{" "}
                <Link href="#" style={{ color: token.colorPrimaryText, textDecoration: "underline" }}>
                    Условиями и положениями
                </Link>
                , а также{" "}
                <Link href="#" style={{ color: token.colorPrimaryText, textDecoration: "underline" }}>
                    Руководством по защите данных
                </Link>
                .
            </Text>

            <div style={{ marginTop: "20px" }}>
                <Button
                    href="/auth/signin"
                    type="primary"
                    style={{
                        width: "100%",
                        maxWidth: "400px",
                        height: "50px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        fontSize: "16px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    }}
                    size="large"
                >
                    Зарегистрироваться
                </Button>
            </div>

            <div style={{ marginTop: "20px" }}>
                <Text style={{ fontSize: "14px" }}>
                    Уже есть аккаунт?{" "}
                    <Link href="/auth/signin" style={{ color: token.colorPrimaryText, fontWeight: "bold" }}>
                        Войти в систему
                    </Link>
                </Text>
            </div>
        </HomeLayout>
    )
}

export default WelcomePage
