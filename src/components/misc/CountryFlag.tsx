import { Tooltip } from "antd"
import PhoneInput from "antd-phone-input"

export default function CountryFlag({ country }: { country: string }) {
    return (
        <>
            <div style={{ display: "none" }}>
                {/* load phone-input styles to use flags from this lib */}
                <PhoneInput />
            </div>

            <Tooltip title={country.toUpperCase()}>
                <div style={{ display: "inline-flex" }} className={"flag " + country.toLowerCase()}></div>
            </Tooltip>
        </>
    )
}
