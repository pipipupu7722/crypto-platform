import { Metadata } from "next"

import { GlobalWrapper } from "../components/global.wrapper"
import "./global.css"

export const metadata: Metadata = {
    title: "Crypto Platform",
    description: "",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>
                <GlobalWrapper>
                    <>{children}</>
                </GlobalWrapper>
            </body>
        </html>
    )
}
