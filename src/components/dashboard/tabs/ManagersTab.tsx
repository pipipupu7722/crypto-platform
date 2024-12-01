"use client"

import { User } from "@prisma/client"
import { Button, Table, TableProps } from "antd"
import { format } from "date-fns"
import { parsePhoneNumber } from "libphonenumber-js"
import { useState } from "react"

import ManagerModal from "../ManagerModal"
import { createManager, updateManagerDetails } from "@/actions/dashboard/manager"
import ClickToCopy from "@/components/misc/ClickToCopy"
import CountryFlag from "@/components/misc/CountryFlag"
import { UserRolesTags, UserStatusTag } from "@/components/misc/Tags"
import { useNotify } from "@/providers/NotificationProvider"
import { ManagerDetailsSchemaType } from "@/schemas/dashboard/manager.schemas"

export default function ManagersTab({ initial }: { initial: User[] }) {
    const [managers, setManagers] = useState(initial)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalLoading, setIsModalLoading] = useState(false)
    const [selectedManager, setSelectedManager] = useState<User | undefined>(undefined)

    const { notify } = useNotify()

    const columns: TableProps<User>["columns"] = [
        {
            title: "Email",
            key: "email",
            render: (_, rec) => <ClickToCopy>{rec.email}</ClickToCopy>,
        },
        {
            title: "Имя Фамилия",
            key: "type",
            render: (_, rec) => <ClickToCopy>{(rec.firstName ?? "N/A") + " " + (rec.lastName ?? "N/A")}</ClickToCopy>,
        },
        {
            title: "Страна и телефон",
            key: "phone",
            render: (_, rec) => (
                <ClickToCopy text={rec.phone}>
                    {rec.country ? <CountryFlag country={rec.country} /> : "N/A"}
                    &nbsp;
                    {rec.phone ? parsePhoneNumber(rec.phone).formatInternational() : "N/A"}
                </ClickToCopy>
            ),
        },
        {
            title: "Роли",
            key: "roles",
            sorter: true,
            render: (_, rec) => <UserRolesTags roles={rec.roles} />,
        },
        {
            title: "Статус",
            key: "status",
            width: 1,
            sorter: true,
            render: (_, rec) => <UserStatusTag status={rec.status} />,
        },
        {
            title: "Дата регистрации",
            key: "date",
            width: 175,
            sorter: true,
            render: (_, rec) => <>{format(rec.createdAt, "dd-MM-yyyy HH:mm:ss")}</>,
        },
        {
            title: "Действия",
            key: "actions",
            width: 1,
            render: (_, rec) => (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                        setSelectedManager(rec)
                        setIsModalOpen(true)
                    }}
                >
                    Управление
                </Button>
            ),
        },
    ]

    return (
        <>
            <Table<User> columns={columns} rowKey={(row) => row.id} dataSource={managers} pagination={false} />

            <div style={{ width: "100%", marginTop: 24, display: "flex", justifyContent: "end" }}>
                <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
                    Добавить менеджера
                </Button>
            </div>

            <ManagerModal
                open={isModalOpen}
                loading={isModalLoading}
                manager={selectedManager}
                isEditing={!!selectedManager}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedManager(undefined)
                }}
                onCreate={async (values: ManagerDetailsSchemaType) => {
                    setIsModalLoading(true)
                    const res = await createManager(values)
                    if (res.success) {
                        setManagers([res, ...managers])
                    } else {
                        notify.error({ message: res.error })
                    }
                    setIsModalLoading(false)
                    setIsModalOpen(false)
                }}
                onUpdate={async (values: ManagerDetailsSchemaType) => {
                    if (!selectedManager) return
                    setIsModalLoading(true)
                    const res = await updateManagerDetails(selectedManager.id, values)
                    if (res.success) {
                        setManagers(managers.map((wallet) => (wallet.id === selectedManager.id ? res : wallet)))
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
