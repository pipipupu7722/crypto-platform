import { PropsWithChildren } from "react"

export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: `url(/assets/img/auth-bg.png)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
            }}
        >
            {children}
        </div>
    )
}
