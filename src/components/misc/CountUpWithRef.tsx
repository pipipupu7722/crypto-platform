"use client"

import React, { useEffect, useRef, useState } from "react"
import CountUp, { CountUpProps } from "react-countup"

export default function CountUpWithRef(props: CountUpProps) {
    const [value, setValue] = useState(props.end)

    const prevValue = useRef(props.start)

    useEffect(() => {
        prevValue.current = value
    }, [value])

    useEffect(() => {
        setValue(props.end)
    }, [props.end])

    return <CountUp {...props} start={prevValue.current} end={value} />
}
