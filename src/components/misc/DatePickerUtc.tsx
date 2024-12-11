"use client"

import { DatePicker, DatePickerProps } from "antd"
import dayjs, { Dayjs } from "dayjs"
import utc from "dayjs/plugin/utc"
import { useState } from "react"

dayjs.extend(utc)

export default function DatePickerUtc(props: DatePickerProps<Dayjs>) {
    const [value, setValue] = useState<Dayjs | null>(props.value ? dayjs(props.value).utc() : null)

    return (
        <DatePicker
            {...props}
            value={value}
            onChange={(date, dateString) => {
                if (date) {
                    const utcDate = date.utc()
                    setValue(utcDate)
                    props.onChange?.(utcDate, dateString)
                }
            }}
        />
    )
}
