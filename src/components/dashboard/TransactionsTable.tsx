import { format } from "date-fns"
import { useEffect, useState } from "react"

import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined,
} from "@ant-design/icons"
import { Table, TableProps, Tag } from "antd"

import { useNotificationContext } from "@/app/providers/NotificationProvider"
import { fetchTransactions } from "@/lib/client/fetchTransactions"
import { Transaction, TransactionStatus, TransactionType } from "@prisma/client"

const columns: TableProps<Transaction>["columns"] = [
    {
        title: "Id",
        key: "id",
        render: (_, rec) => <a>{rec.id}</a>,
    },
    {
        title: "Amount",
        key: "amount",
        render: (_, rec) => (rec.amount ? rec.amount.toFixed(2) + " $" : "-"),
    },
    {
        title: "Type",
        key: "type",
        render: (_, rec) => (
            <>
                {rec.type === TransactionType.DEPOSIT ? (
                    <Tag color="gold">
                        <ArrowDownOutlined /> Депозит
                    </Tag>
                ) : (
                    <Tag color="green">
                        <ArrowUpOutlined /> Вывод
                    </Tag>
                )}
            </>
        ),
    },
    {
        title: "Status",
        key: "status",
        render: (_, rec) => {
            if (rec.status === TransactionStatus.PENDING) {
                return (
                    <Tag icon={<SyncOutlined spin />} color="processing">
                        В обработке
                    </Tag>
                )
            } else if (rec.status === TransactionStatus.COMPLETE) {
                return (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                        Выполнен
                    </Tag>
                )
            } else if (rec.status === TransactionStatus.CANCELLED) {
                return (
                    <Tag icon={<CloseCircleOutlined />} color="error">
                        Отменен
                    </Tag>
                )
            }
        },
    },
    {
        title: "Date",
        key: "date",
        render: (_, rec) => <>{format(rec.createdAt, "yyyy-MM-dd HH:mm:ss")}</>,
    },
]

const TransactionsTable: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[] | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    const { notify } = useNotificationContext()

    useEffect(() => {
        fetchTransactions()
            .then(setTransactions)
            .catch((error) => notify.error({ message: error.message }))
            .finally(() => setLoading(false))
    }, [])

    return (
        <Table<Transaction>
            columns={columns}
            rowKey={(trx) => trx.id}
            dataSource={transactions}
            pagination={false}
            loading={loading}
            style={{
                height: "100%",
            }}
        />
    )
}
export default TransactionsTable
