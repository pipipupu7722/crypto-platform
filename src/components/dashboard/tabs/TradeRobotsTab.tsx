"use client"

import { TradeRobot, TradeRobotStatus, UserRole } from "@prisma/client"
import { Button, Popconfirm, Table, TableProps } from "antd"
import { format } from "date-fns"
import { useState } from "react"

import TradeRobotModal from "../TradeRobotModal"
import { closeTradeRobot, createTradeRobot, updateTradeRobot } from "@/actions/dashboard/tradeRobot"
import ClickToCopy from "@/components/misc/ClickToCopy"
import { TradeRobotStatusTag } from "@/components/misc/Tags"
import { useNotify } from "@/providers/NotifyProvider"
import { useSession } from "@/providers/SessionProvider"

export default function TradeRobotsTab({
    userId,
    initialTradeRobots,
}: {
    userId: string
    initialTradeRobots: TradeRobot[]
}) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [tradeRobots, setTradeRobots] = useState(initialTradeRobots)
    const [selectedTradeRobot, setSelectedTradeRobot] = useState<TradeRobot | undefined>(undefined)

    const { session } = useSession()
    const { notify } = useNotify()

    const columns: TableProps<TradeRobot>["columns"] = [
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
            render: (_, rec) => <TradeRobotStatusTag status={rec.status} />,
        },
        {
            title: "Дата закрытия",
            key: "date",
            width: 140,
            render: (_, rec) => (
                <>{format(rec.closedAt ? new Date(rec.closedAt) : new Date(rec.closesAt), "dd-MM-yyyy")}</>
            ),
        },
    ]

    if (session.User.roles.includes(UserRole.ADMIN)) {
        columns.push({
            title: "Действия",
            key: "actions",
            width: 1,
            render: (_, rec) => (
                <div style={{ display: "flex", justifyContent: "end", gap: 8 }}>
                    {rec.status === TradeRobotStatus.ACTIVE && (
                        <Popconfirm
                            title="Досрочно закрыть стратегию?"
                            placement="topLeft"
                            okText="Подтвердить"
                            cancelText="Отмена"
                            onConfirm={() => {
                                setIsLoading(true)
                                closeTradeRobot(rec.id)
                                    .then((res) =>
                                        res.success
                                            ? setTradeRobots(
                                                  tradeRobots.map((tradeRobot) =>
                                                      tradeRobot.id === res.id ? res : tradeRobot
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
                            setSelectedTradeRobot(rec)
                            setIsModalOpen(true)
                        }}
                    >
                        Управление
                    </Button>
                </div>
            ),
        })
    }

    return (
        <>
            <Table<TradeRobot>
                columns={columns}
                pagination={false}
                rowKey={(row) => row.id}
                dataSource={tradeRobots}
                style={{ height: "100%" }}
            />

            <div style={{ width: "100%", marginTop: 24, display: "flex", justifyContent: "end" }}>
                <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
                    Добавить стратегию
                </Button>
            </div>

            <TradeRobotModal
                open={isModalOpen}
                loading={isLoading}
                tradeRobot={selectedTradeRobot}
                isEditing={!!selectedTradeRobot}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedTradeRobot(undefined)
                }}
                onUpdate={async (values) => {
                    setIsLoading(true)
                    const res = await updateTradeRobot(selectedTradeRobot?.id, values)
                    if (res.success) {
                        const { success, ...updated } = res
                        setTradeRobots(
                            tradeRobots.map((tradeRobot) => (tradeRobot.id === updated.id ? updated : tradeRobot))
                        )
                    } else {
                        notify.error({ message: res.error })
                    }
                    setIsLoading(false)
                    setIsModalOpen(false)
                }}
                onCreate={async (values) => {
                    setIsLoading(true)
                    const res = await createTradeRobot(userId, values)
                    if (res.success) {
                        setTradeRobots([res, ...tradeRobots])
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
