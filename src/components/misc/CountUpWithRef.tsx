"use client"

import { theme } from "antd"
import React, { useEffect, useRef, useState } from "react"
import CountUp, { CountUpProps } from "react-countup"

export default function CountUpWithRef(props: CountUpProps) {
    const [value, setValue] = useState(props.end)
    const [diff, setDiff] = useState<number | null>(null)

    const prevValue = useRef(props.start)
    const { token } = theme.useToken()

    useEffect(() => {
        prevValue.current = value
    }, [value])

    useEffect(() => {
        setValue(props.end)
        if (prevValue.current && props.end !== prevValue.current) {
            setDiff(props.end - prevValue.current)

            const timeout = setTimeout(() => setDiff(null), 1500)
            return () => clearTimeout(timeout)
        }
    }, [props.end])

    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            <CountUp {...props} start={prevValue.current} end={value} />
            {diff !== null && (
                <span
                    style={{
                        position: "absolute",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: diff > 0 ? token.colorSuccess : token.colorErrorText,
                        opacity: 1,
                        animation: "rise-and-fade 3s forwards",
                    }}
                >
                    {diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)}$
                </span>
            )}
            <style jsx>{`
                @keyframes rise-and-fade {
                    0% {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-50%, -20px);
                    }
                }
            `}</style>
        </div>
    )
}
