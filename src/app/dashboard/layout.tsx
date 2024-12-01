"use server"

import { PropsWithChildren } from "react"

import Header from "@/components/layout/Header"
import DashboardSidebar from "@/components/layout/panel/DashboardSidebar"
import PanelLayout from "@/components/layout/panel/PanelLayout"

export default async function DashboardLayout({ children }: PropsWithChildren) {
    return (
        <PanelLayout sidebar={<DashboardSidebar />} header={<Header />}>
            {children}
        </PanelLayout>
    )
}
