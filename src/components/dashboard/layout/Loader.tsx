"use client"

import React, { useEffect, useState } from "react"

import { Spin, theme } from "antd"

export default function Loader() {
    const [loading, setLoading] = useState<boolean>(true)
    const [fadeOut, setFadeOut] = useState<boolean>(false)

    const { token } = theme.useToken()

    useEffect(() => {
        setTimeout(() => {
            setFadeOut(true)
            setTimeout(() => {
                setLoading(false)
            }, 200)
        }, 100)
    }, [])

    if (!loading) return null

    return (
        <div
            style={{
                backgroundColor: token.colorBgContainer,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
                opacity: fadeOut ? 0 : 1,
                transition: "opacity 0.2s ease-in-out",
                pointerEvents: fadeOut ? "none" : "auto",
            }}
        >
            <Spin size="large" />
        </div>
    )
}
