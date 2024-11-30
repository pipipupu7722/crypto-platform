"use client"

import { UserAuthLog } from "@prisma/client"
import { Table, TableProps } from "antd"
import { format } from "date-fns"

import ClickToCopy from "@/components/misc/ClickToCopy"
import { UserAuthLogTypeTag } from "@/components/misc/Tags"

export default function AuthLogTab({ initial }: { initial: UserAuthLog[] }) {
    const columns: TableProps<UserAuthLog>["columns"] = [
        {
            title: "ID Сессии",
            key: "sessionId",
            render: (_, rec) => <ClickToCopy>{rec.sessionId}</ClickToCopy>,
        },
        {
            title: "Тип",
            key: "type",
            render: (_, rec) => <UserAuthLogTypeTag type={rec.type} />,
        },
        {
            title: "IP адрес",
            key: "ipAddress",
            render: (_, rec) => rec.ipAddress,
        },
        {
            title: "Дата",
            key: "createdAt",
            render: (_, rec) => <>{format(rec.createdAt, "dd-MM-yyyy HH:mm:ss")}</>,
        },
    ]

    return (
        <Table<UserAuthLog>
            columns={columns}
            pagination={false}
            rowKey={(row) => row.id}
            dataSource={initial}
            style={{ height: "100%" }}
        />
    )
}
