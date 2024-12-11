import { Metadata } from "next"
import { PropsWithChildren } from "react"

import { AntdProvider } from "../providers/AntdProvider"
import { NotifyProvider } from "../providers/NotifyProvider"

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
                }}
            >
                <AntdProvider>
                    <NotifyProvider>
                        <>{children}</>
                    </NotifyProvider>
                </AntdProvider>
            </body>
        </html>
    )
}
