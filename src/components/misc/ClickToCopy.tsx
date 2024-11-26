"use client"

import { Tooltip, theme } from "antd"
import { PropsWithChildren, useState } from "react"

export default function ClickToCopy({ children, text }: PropsWithChildren & { text?: string | null }) {
    const defaultTooltip = "Нажмите чтобы скопировать"

    const { token } = theme.useToken()
    const [tooltip, setTooltip] = useState(defaultTooltip)
    const [hovered, setHovered] = useState(false)

    const handleCopy = () => {
        const textToCopy = text ?? children?.toString() ?? ""
        navigator.clipboard.writeText(textToCopy)
        setTooltip("Текст скопирован!")
    }

    return (
        <Tooltip title={tooltip} onOpenChange={(state) => setTooltip(state ? tooltip : defaultTooltip)}>
            <span
                style={{
                    cursor: "pointer",
                    padding: "2px 5px",
                    borderRadius: "4px",
                    transition: "background-color 0.2s",
                    backgroundColor: hovered ? token.colorFillTertiary : "transparent",
                }}
                onClick={handleCopy}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {children}
            </span>
        </Tooltip>
    )
}
