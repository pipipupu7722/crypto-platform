"use client"

import { Transaction } from "@prisma/client"
import { Button, Table, TableProps } from "antd"
import { format } from "date-fns"

import ClickToCopy from "../misc/ClickToCopy"
import { TransactionStatusTag, TransactionTypeTag } from "../misc/Tags"
import { useNotify } from "@/providers/NotificationProvider"

const TransactionsTable = ({
    transactions,
    action,
}: {
    transactions: Transaction[]
    action?: (transaction: Transaction) => void
}) => {
    const { notify } = useNotify()

    const columns: TableProps<Transaction>["columns"] = [
        {
            title: "Адрес кошелька",
            key: "txHash",
            render: (_, rec) => (
                <>
                    <span>{rec.crypto} </span>
                    <ClickToCopy text={rec.wallet}>{rec.wallet ?? "N/A"}</ClickToCopy>
                </>
            ),
        },
        {
            title: "Сумма $",
            key: "amountUsd",
            render: (_, rec) => (rec.amountUsd ? rec.amountUsd.toFixed(2) + " $" : "-"),
            sorter: (a, b) => a.amountUsd - b.amountUsd,
        },
        {
            title: "Тип",
            key: "type",
            width: 1,
            render: (_, rec) => <TransactionTypeTag type={rec.type} />,
            sorter: (a, b) => a.type.localeCompare(b.type),
        },
        {
            title: "Статус",
            key: "status",
            width: 1,
            render: (_, rec) => <TransactionStatusTag status={rec.status} />,
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
        {
            title: "Дата",
            key: "date",
            width: 175,
            render: (_, rec) => <>{format(rec.createdAt, "dd-MM-yyyy HH:mm:ss")}</>,
            sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        },
    ]

    if (action) {
        columns.push({
            title: "Действия",
            key: "actions",
            width: 1,
            render: (_, rec) => (
                <Button type="primary" size="small" onClick={() => action(rec)}>
                    Управление
                </Button>
            ),
        })
    }

    return (
        <Table<Transaction>
            columns={columns}
            pagination={false}
            rowKey={(trx) => trx.id}
            dataSource={transactions}
            style={{ height: "100%" }}
        />
    )
}
export default TransactionsTable
