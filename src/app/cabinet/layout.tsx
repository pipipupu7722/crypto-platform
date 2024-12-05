"use server"

import React, { PropsWithChildren } from "react"

import CabinetHeader from "@/components/layout/panel/CabinetHeader"
import CabinetSidebar from "@/components/layout/panel/CabinetSidebar"
import PanelLayout from "@/components/layout/panel/PanelLayout"
import { depositWalletsService } from "@/lib/server/services/depositWallets.service"
import { getSession } from "@/lib/server/session"

export default async function CabinetLayout({ children }: PropsWithChildren) {
    const session = await getSession()

    const wallets = await depositWalletsService.getActiveByUser(session.userId)

    return (
        <PanelLayout sidebar={<CabinetSidebar />} header={<CabinetHeader wallets={wallets} />}>
            {children}
        </PanelLayout>
    )
}
