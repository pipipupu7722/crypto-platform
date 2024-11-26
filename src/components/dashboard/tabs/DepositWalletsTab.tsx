"use client"

import { DepositWallet } from "@prisma/client"
import { Table, TableProps } from "antd"
import { format } from "date-fns"

import ClickToCopy from "@/components/misc/ClickToCopy"
import { DepositWalletStatusTag } from "@/components/misc/Tags"

export default function DepositWalletsTab({ initialAddresses }: { initialAddresses: DepositWallet[] }) {
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
            render: (_, rec) => rec.description,
        },
        {
            title: "Статус",
            key: "status",
            render: (_, rec) => <DepositWalletStatusTag status={rec.status} />,
        },
        {
            title: "Дата добавления",
            key: "date",
            render: (_, rec) => <>{format(rec.createdAt, "dd-MM-yyyy HH:mm:ss")}</>,
        },
    ]

    return (
        <Table<DepositWallet>
            columns={columns}
            pagination={false}
            rowKey={(row) => row.id}
            dataSource={initialAddresses}
            style={{ height: "100%" }}
        />
    )
}
