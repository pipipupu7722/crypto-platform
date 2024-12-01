"use client"

import { Cryptocurrency, DepositWallet, Transaction } from "@prisma/client"
import { Button } from "antd"
import { useState } from "react"

import TransactionModal from "../TransactionModal"
import TransactionsTable from "../TransactionsTable"
import { createDepositTransaction, updateTransaction } from "@/actions/dashboard/transaction"
import { useNotify } from "@/providers/NotificationProvider"

export default function TransactionsTab({
    userId,
    initialTransactions,
    cryptocurrencies,
    depositWallets,
}: {
    userId: string
    initialTransactions: Transaction[]
    cryptocurrencies: Cryptocurrency[]
    depositWallets: DepositWallet[]
}) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalLoading, setIsModalLoading] = useState(false)
    const [transactions, setTransactions] = useState(initialTransactions)
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined)

    const { notify } = useNotify()

    return (
        <>
            <TransactionsTable
                transactions={transactions}
                action={(transaction) => {
                    setSelectedTransaction(transaction)
                    setIsModalOpen(true)
                }}
            />

            <div style={{ width: "100%", marginTop: 24, display: "flex", justifyContent: "end" }}>
                <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
                    Добавить депозит
                </Button>
            </div>

            <TransactionModal
                open={isModalOpen}
                loading={isModalLoading}
                depositWallets={depositWallets}
                cryptocurrencies={cryptocurrencies}
                transaction={selectedTransaction}
                isEditing={!!selectedTransaction}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedTransaction(undefined)
                }}
                onUpdate={async (values) => {
                    setIsModalLoading(true)
                    const res = await updateTransaction(selectedTransaction?.id, values)
                    if (res.success) {
                        const { success, ...updated } = res
                        setTransactions(
                            transactions.map((transaction) => (transaction.id === updated.id ? updated : transaction))
                        )
                    } else {
                        notify.error({ message: res.error })
                    }
                    setIsModalLoading(false)
                    setIsModalOpen(false)
                }}
                onCreate={async (values) => {
                    setIsModalLoading(true)
                    const res = await createDepositTransaction(userId, values)
                    if (res.success) {
                        setTransactions([res, ...transactions])
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
