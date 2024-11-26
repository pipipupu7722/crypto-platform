import { Tooltip } from "antd"
import PhoneInput from "antd-phone-input"

export default function CountryFlag({ country }: { country: string }) {
    return (
        <>
            <PhoneInput style={{ display: "none" }} />

            <Tooltip title={country.toUpperCase()}>
                <div style={{ display: "inline-flex" }} className={"flag " + country.toLowerCase()}></div>
            </Tooltip>
        </>
    )
}
