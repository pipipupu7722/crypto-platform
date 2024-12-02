"use client"

import { Strategy, StrategyStatus } from "@prisma/client"
import { Button, Popconfirm, Table, TableProps } from "antd"
import { format } from "date-fns"
import { useState } from "react"

import StrategyModal from "../StrategyModal"
import { closeStrategy, createStrategy, updateStrategy } from "@/actions/dashboard/strategy"
import ClickToCopy from "@/components/misc/ClickToCopy"
import { StrategyStatusTag } from "@/components/misc/Tags"
import { useNotify } from "@/providers/NotifyProvider"

export default function StrategiesTab({
    userId,
    initialStrategies,
}: {
    userId: string
    initialStrategies: Strategy[]
}) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [strategies, setStrategies] = useState(initialStrategies)
    const [selectedStrategy, setSelectedStrategy] = useState<Strategy | undefined>(undefined)

    const { notify } = useNotify()

    const columns: TableProps<Strategy>["columns"] = [
        {
            title: "Название",
            key: "name",
            render: (_, rec) => <ClickToCopy>{rec.name}</ClickToCopy>,
        },
        {
            title: "Вклад / Доход",
            key: "invested",
            render: (_, rec) => `${rec.invested.toFixed(2)}$ / ${rec.profit.toFixed(2)}$`,
        },
        {
            title: "PnL Real",
            key: "realProfitMin",
            render: (_, rec) => `${(rec.realProfitMin * 100).toFixed(0)}% / ${(rec.realProfitMax * 100).toFixed(0)}%`,
        },
        {
            title: "PnL Fake",
            key: "fakeProfitMin",
            render: (_, rec) => `${(rec.fakeProfitMin * 100).toFixed(0)}% / ${(rec.fakeProfitMax * 100).toFixed(0)}%`,
        },
        {
            title: "Статус",
            key: "status",
            width: 1,
            render: (_, rec) => <StrategyStatusTag status={rec.status} />,
        },
        {
            title: "Дата добавления",
            key: "date",
            width: 175,
            render: (_, rec) => <>{format(new Date(rec.createdAt), "dd-MM-yyyy HH:mm:ss")}</>,
        },
        {
            title: "Действия",
            key: "actions",
            width: 1,
            render: (_, rec) => (
                <div style={{ display: "flex", justifyContent: "end", gap: 8 }}>
                    {rec.status === StrategyStatus.ACTIVE && (
                        <Popconfirm
                            title="Досрочно закрыть стратегию?"
                            placement="topLeft"
                            okText="Подтвердить"
                            cancelText="Отмена"
                            onConfirm={() => {
                                setIsLoading(true)
                                closeStrategy(rec.id)
                                    .then((res) =>
                                        res.success
                                            ? setStrategies(
                                                  strategies.map((strategy) =>
                                                      strategy.id === res.id ? res : strategy
                                                  )
                                              )
                                            : notify.error({ message: res.error })
                                    )
                                    .finally(() => setIsLoading(false))
                            }}
                        >
                            <Button danger size="small" loading={isLoading} onClick={() => {}}>
                                Закрыть
                            </Button>
                        </Popconfirm>
                    )}
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            setSelectedStrategy(rec)
                            setIsModalOpen(true)
                        }}
                    >
                        Управление
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <>
            <Table<Strategy>
                columns={columns}
                pagination={false}
                rowKey={(row) => row.id}
                dataSource={strategies}
                style={{ height: "100%" }}
            />

            <div style={{ width: "100%", marginTop: 24, display: "flex", justifyContent: "end" }}>
                <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
                    Добавить стратегию
                </Button>
            </div>

            <StrategyModal
                open={isModalOpen}
                loading={isLoading}
                strategy={selectedStrategy}
                isEditing={!!selectedStrategy}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedStrategy(undefined)
                }}
                onUpdate={async (values) => {
                    setIsLoading(true)
                    const res = await updateStrategy(selectedStrategy?.id, values)
                    if (res.success) {
                        const { success, ...updated } = res
                        setStrategies(strategies.map((strategy) => (strategy.id === updated.id ? updated : strategy)))
                    } else {
                        notify.error({ message: res.error })
                    }
                    setIsLoading(false)
                    setIsModalOpen(false)
                }}
                onCreate={async (values) => {
                    setIsLoading(true)
                    const res = await createStrategy(userId, values)
                    if (res.success) {
                        setStrategies([res, ...strategies])
                    } else {
                        notify.error({ message: res.error })
                    }
                    setIsLoading(false)
                    setIsModalOpen(false)
                }}
            />
        </>
    )
}
