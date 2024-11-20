import { Metadata } from "next"
import { PropsWithChildren } from "react"

import { AntdProvider } from "./providers/AntdProvider"
import { NotificationProvider } from "./providers/NotificationProvider"

export const metadata: Metadata = {
    title: "Crypto Platform",
    description: "",
}

export default async function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <body
                style={{
                    padding: 0,
                    margin: 0,
                    background: "#131313",
                    color: "#dcdcdc",
                }}
            >
                <AntdProvider>
                    <NotificationProvider>
                        <>{children}</>
                    </NotificationProvider>
                </AntdProvider>
            </body>
        </html>
    )
}
