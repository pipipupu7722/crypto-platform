"use client"

import { Transaction, TransactionType } from "@prisma/client"
import { Button, Table, TableProps } from "antd"
import { format } from "date-fns"

import { TransactionStatusTag, TransactionTypeTag } from "../misc/Tags"
import { useNotify } from "@/providers/NotifyProvider"

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
            title: "Актив",
            key: "crypto",
            width: 1,
            render: (_, rec) => (rec.crypto ? rec.crypto : "Bank USD"),
            sorter: (a, b) => (a.crypto && b.crypto ? a.crypto.localeCompare(b.crypto) : 0),
        },
        {
            title: "Сумма",
            key: "amountUsd",
            render: (_, rec) => (rec.type === TransactionType.DEPOSIT ? "+" : "-") + rec.amountUsd.toFixed(2) + " $",
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
            render: (_, rec) => <>{format(rec.createdAt, "HH:mm:ss dd.MM.yyyy")}</>,
            sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        },
    ]

    if (action) {
        columns.push({
            title: "Действия",
            key: "actions",
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
            scroll={{ x: "min-content" }}
        />
    )
}
export default TransactionsTable
