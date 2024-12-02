"use client"

import { Button, Col, Row, Typography } from "antd"
import Image from "next/image"
import React from "react"

import { appconf } from "@/appconf"

const { Title, Text, Link } = Typography

const WelcomePage = () => {
    return (
        <>
            <style jsx global>{`
                html,
                body {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    background: linear-gradient(135deg, #1a1a1a, #333);
                    font-family: Arial, sans-serif;
                    color: #dcdcdc;
                    flex-direction: column;
                    background: #131313;
                    color: #dcdcdc;
                    overflow: hidden;
                }
                #__next {
                    height: 100%;
                }
            `}</style>

            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "60px",
                    background: "#1a1a1a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 20px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    zIndex: 1000,
                    flex: 1,
                    overflow: "hidden",
                }}
            >
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ffffff" }}>{appconf.appName}</div>
                <Button
                    href="/auth/signin"
                    type="primary"
                    style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        textDecoration: "none",
                    }}
                >
                    Войти
                </Button>
            </div>

            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px",
                    paddingTop: "100px",
                }}
            >
                <Row align="middle" justify="center" style={{ maxWidth: "1200px", width: "100%" }} gutter={[32, 32]}>
                    <Col xs={24} md={12} style={{ textAlign: "center", padding: "20px" }}>
                        <Title level={2} style={{ fontWeight: "bold", color: "#ffffff" }}>
                            Добро пожаловать в {appconf.appName}
                        </Title>
                        <Text style={{ fontSize: "16px", color: "#a6a6a6", lineHeight: "1.6" }}>
                            Создавая аккаунт, вы соглашаетесь с нашими{" "}
                            <Link href="#" style={{ color: "#1890ff" }}>
                                Условиями и положениями
                            </Link>
                            , а также{" "}
                            <Link href="#" style={{ color: "#1890ff" }}>
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
                            <Text style={{ fontSize: "14px", color: "#b3b3b3" }}>
                                Уже есть аккаунт?{" "}
                                <Link href="/auth/signin" style={{ color: "#1890ff", fontWeight: "bold" }}>
                                    Войти в систему
                                </Link>
                            </Text>
                        </div>
                    </Col>

                    <Col xs={24} md={12} style={{ textAlign: "center", padding: "20px" }}>
                        <Image
                            src="/images/home.png"
                            alt="Пример приложения"
                            width={400}
                            height={400}
                            style={{
                                maxWidth: "100%",
                                height: "auto",
                                borderRadius: "12px",
                            }}
                            priority
                        />
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default WelcomePage
