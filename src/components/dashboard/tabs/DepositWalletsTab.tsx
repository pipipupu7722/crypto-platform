"use client"

import { Cryptocurrency, DepositWallet, UserRole } from "@prisma/client"
import { Button, Table, TableProps } from "antd"
import { format } from "date-fns"
import { useState } from "react"

import DepositWalletModal from "../DepositWalletModal"
import { createDepositWallet, updateDepositWallet } from "@/actions/dashboard/depositWallet"
import ClickToCopy from "@/components/misc/ClickToCopy"
import { DepositWalletStatusTag } from "@/components/misc/Tags"
import { hasRole } from "@/lib/helpers"
import { useNotify } from "@/providers/NotificationProvider"
import { useSession } from "@/providers/SessionProvider"
import type { DepositWalletSchemaType } from "@/schemas/dashboard/depositWallets.schemas"

export default function DepositWalletsTab({
    userId,
    cryptocurrencies,
    initialAddresses,
}: {
    userId: string
    cryptocurrencies: Cryptocurrency[]
    initialAddresses: DepositWallet[]
}) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalLoading, setIsModalLoading] = useState(false)
    const [addresses, setAddresses] = useState(initialAddresses)
    const [selectedWallet, setSelectedWallet] = useState<DepositWallet | undefined>(undefined)

    const { session } = useSession()
    const { notify } = useNotify()

    const isAdmin = hasRole(session.User.roles, [UserRole.ADMIN])

    const columns: TableProps<DepositWallet>["columns"] = [
        {
            title: "Криптовалюта",
            key: "crypto",
            render: (_, rec) => <ClickToCopy>{rec.crypto}</ClickToCopy>,
        },
        {
            title: "Адрес кошелька",
            key: "wallet",
            render: (_, rec) => <ClickToCopy>{rec.wallet}</ClickToCopy>,
        },
        {
            title: "Описание",
            key: "description",
            render: (_, rec) => rec.description || "N/A",
        },
        {
            title: "Статус",
            key: "status",
            width: 1,
            render: (_, rec) => <DepositWalletStatusTag status={rec.status} />,
        },
        {
            title: "Дата добавления",
            key: "date",
            width: 175,
            render: (_, rec) => <>{format(new Date(rec.createdAt), "dd-MM-yyyy HH:mm:ss")}</>,
        },
    ]

    if (isAdmin) {
        columns.push({
            title: "Действия",
            key: "actions",
            width: 1,
            render: (_, rec) => (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                        setSelectedWallet(rec)
                        setIsModalOpen(true)
                    }}
                >
                    Управление
                </Button>
            ),
        })
    }

    return (
        <>
            <Table<DepositWallet>
                columns={columns}
                pagination={false}
                rowKey={(row) => row.id}
                dataSource={addresses}
                style={{ height: "100%" }}
            />

            {isAdmin && (
                <div
                    style={{
                        width: "100%",
                        marginTop: 24,
                        display: "flex",
                        justifyContent: "end",
                    }}
                >
                    <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
                        Добавить кошелек
                    </Button>
                </div>
            )}

            <DepositWalletModal
                open={isModalOpen}
                loading={isModalLoading}
                wallet={selectedWallet}
                cryptocurrencies={cryptocurrencies}
                isEditing={!!selectedWallet}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedWallet(undefined)
                }}
                onCreate={async (values: DepositWalletSchemaType) => {
                    setIsModalLoading(true)
                    const res = await createDepositWallet(userId, values)
                    if (res.success) {
                        setAddresses([res, ...addresses])
                    } else {
                        notify.error({ message: res.error })
                    }
                    setIsModalLoading(false)
                    setIsModalOpen(false)
                }}
                onUpdate={async (values: DepositWalletSchemaType) => {
                    if (!selectedWallet) return
                    setIsModalLoading(true)
                    const res = await updateDepositWallet(selectedWallet.id, values)
                    if (res.success) {
                        setAddresses(addresses.map((wallet) => (wallet.id === selectedWallet.id ? res : wallet)))
                    } else {
                        notify.error({ message: res.error })
                    }
                    setIsModalLoading(false)
                    setIsModalOpen(false)
                }}
            />
        </>
    )
}
