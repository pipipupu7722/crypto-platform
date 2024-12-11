import { PropsWithChildren } from "react"

import HomeLayout from "@/components/layout/HomeLayout"

export default function AuthLayout({ children }: PropsWithChildren) {
    return <HomeLayout>{children}</HomeLayout>
}
