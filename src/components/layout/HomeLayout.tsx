"use client"

import { Button, Col, Row, Typography, theme } from "antd"
import Image from "next/image"
import React, { PropsWithChildren } from "react"

import { appconf } from "@/appconf"

const HomeLayout = ({ children }: PropsWithChildren) => {
    const { token } = theme.useToken()

    return (
        <>
            <style jsx global>{`
                html,
                body {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    font-family: Arial, sans-serif;
                    flex-direction: column;
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
                    color: token.colorTextLightSolid,
                    background: token.colorBgHeader,
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
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>{appconf.appName}</div>
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
                    height: "100%",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                }}
            >
                <Row align="middle" justify="center" style={{ width: "100%", height: "100%" }} gutter={[32, 32]}>
                    <Col xs={24} md={12} style={{ textAlign: "center", padding: "20px" }}>
                        {children}
                    </Col>

                    <Col
                        xs={24}
                        md={12}
                        style={{
                            alignContent: "center",
                            textAlign: "center",
                            padding: "20px",
                            height: "100%",
                            backgroundColor: token.colorBgSolid,
                        }}
                    >
                        <Image
                            src="/assets/home.gif"
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

export default HomeLayout