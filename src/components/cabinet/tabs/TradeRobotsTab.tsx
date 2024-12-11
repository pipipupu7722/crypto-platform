"use client"

import { TradeRobot, TradeRobotStatus } from "@prisma/client"
import { Button, Descriptions, Form, InputNumber, Modal, Table, TableProps } from "antd"
import { format } from "date-fns"
import { useState } from "react"

import { startTradeRobot } from "@/actions/cabinet/tradeRobot"
import CountUpWithRef from "@/components/misc/CountUpWithRef"
import { TradeRobotStatusTag } from "@/components/misc/Tags"
import { AppEvents } from "@/lib/events"
import { useNotify } from "@/providers/NotifyProvider"
import { sseReceiver } from "@/providers/SseProvider"
import { TradeRobotStartSchemaRule, TradeRobotStartSchemaType } from "@/schemas/cabinet/tradeRobot.schemas"

export default function TradeRobotsTab({ initialTradeRobots }: { initialTradeRobots: TradeRobot[] }) {
    const [form] = Form.useForm<TradeRobotStartSchemaType>()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalLoading, setIsModalLoading] = useState(false)
    const [tradeRobots, setTradeRobots] = useState(initialTradeRobots)
    const [tradeRobot, setTradeRobot] = useState<TradeRobot | undefined>(undefined)

    const { notify } = useNotify()

    sseReceiver.on(AppEvents.TradeRobotsRecalculated, (payload) =>
        setTradeRobots(
            tradeRobots.map((tradeRobot) => {
                const updated = payload.tradeRobots.find((updated) => tradeRobot.id === updated.id)
                return updated ? { ...tradeRobot, ...updated } : tradeRobot
            })
        )
    )

    const columns: TableProps<TradeRobot>["columns"] = [
        {
            title: "Название",
            key: "name",
            render: (_, rec) => rec.name,
        },
        {
            title: "Вклад / Доход",
            key: "invested",
            render: (_, rec) => (
                <>
                    <CountUpWithRef end={rec.invested} decimals={2} suffix=" $" />
                    {" / "}
                    <span
                        style={{
                            color: rec.profit > 0 ? "green" : rec.profit < 0 ? "red" : "black",
                        }}
                    >
                        <CountUpWithRef end={rec.profit} decimals={4} suffix=" $" />
                    </span>
                </>
            ),
        },
        {
            title: "PnL",
            key: "fakeProfitMin",
            render: (_, rec) => (
                <>
                    <article style={{ textWrap: "nowrap" }}>
                        {(rec.fakeProfitMin * 100).toFixed(0)}%{" - "}
                    </article>
                    {(rec.fakeProfitMax * 100).toFixed(0)}%
                </>
            ),
        },
        {
            title: "Ожидаемый доход",
            key: "fakeProfitMax",
            width: 175,
            render: (_, rec) =>
                rec.invested > 0 ? (
                    <>
                        <article style={{ textWrap: "nowrap" }}>
                            {(rec.invested * rec.fakeProfitMin).toFixed(2)}${" - "}
                        </article>
                        {(rec.invested * rec.fakeProfitMax).toFixed(2)}$
                    </>
                ) : (
                    "N/A"
                ),
        },
        {
            title: "Статус",
            key: "status",
            width: 1,
            render: (_, rec) => <TradeRobotStatusTag status={rec.status} />,
        },
        {
            title: "Дата закрытия",
            key: "closesAt",
            width: 150,
            render: (_, rec) => <>{format(rec.closedAt ?? rec.closesAt, "dd-MM-yyyy")}</>,
        },
        {
            title: "Действия",
            key: "actions",
            width: 1,
            render: (_, rec) => (
                <Button
                    ghost
                    type="primary"
                    size="small"
                    onClick={() => {
                        setTradeRobot(rec)
                        setIsModalOpen(true)
                    }}
                >
                    Подробнее
                </Button>
            ),
        },
    ]

    return (
        <>
            <Table<TradeRobot>
                columns={columns}
                pagination={false}
                rowKey={(row) => row.id}
                dataSource={tradeRobots}
                style={{ height: "100%" }}
                scroll={{ x: "min-content" }}
            />

            <Modal
                open={isModalOpen}
                title={"О торговом роботе"}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    tradeRobot?.status === TradeRobotStatus.AVAILABLE && (
                        <Button
                            key="submit"
                            type="primary"
                            loading={isModalLoading}
                            onClick={() => {
                                setIsModalLoading(true)
                                form.validateFields()
                                    .then((values) => startTradeRobot(tradeRobot?.id, values.amount))
                                    .then((res) => {
                                        if (res.success) {
                                            const { success, ...updated } = res
                                            setTradeRobots(
                                                tradeRobots.map((row) => (row.id === updated.id ? updated : row))
                                            )
                                        } else {
                                            notify.error({ message: res.error })
                                        }
                                    })
                                    .catch(() => notify.error({ message: "Что-то пошло не так" }))
                                    .finally(() => {
                                        setIsModalLoading(false)
                                        setIsModalOpen(false)
                                    })
                            }}
                        >
                            Инвестировать
                        </Button>
                    ),
                    <Button key="cancel" style={{ marginLeft: 8 }} onClick={() => setIsModalOpen(false)}>
                        Закрыть
                    </Button>,
                ]}
            >
                {tradeRobot && (
                    <>
                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label="Название">{tradeRobot.name}</Descriptions.Item>

                            <Descriptions.Item label="Доходность">
                                {`${(tradeRobot.fakeProfitMin * 100).toFixed(0)}% / ${(tradeRobot.fakeProfitMax * 100).toFixed(0)}%`}
                            </Descriptions.Item>

                            {tradeRobot.startedAt && (
                                <Descriptions.Item label="Инвестиция">
                                    {tradeRobot.invested.toFixed(2)} $
                                </Descriptions.Item>
                            )}

                            {tradeRobot.startedAt && (
                                <Descriptions.Item label="Прибыль">{tradeRobot.profit.toFixed(2)} $</Descriptions.Item>
                            )}

                            <Descriptions.Item label="Статус">
                                {<TradeRobotStatusTag status={tradeRobot.status} />}
                            </Descriptions.Item>

                            {tradeRobot.createdAt && (
                                <Descriptions.Item label="Дата добавления">
                                    {format(tradeRobot.createdAt, "dd-MM-yyyy")}
                                </Descriptions.Item>
                            )}

                            {tradeRobot.startedAt && (
                                <Descriptions.Item label="Дата старта">
                                    {format(tradeRobot.startedAt, "dd-MM-yyyy")}
                                </Descriptions.Item>
                            )}

                            {tradeRobot.closesAt && !tradeRobot.closedAt && (
                                <Descriptions.Item label="Дата закрытия">
                                    {format(tradeRobot.closesAt, "dd-MM-yyyy")}
                                </Descriptions.Item>
                            )}

                            {tradeRobot.closedAt && (
                                <Descriptions.Item label="Дата закрытия">
                                    {format(tradeRobot.closedAt, "dd-MM-yyyy")}
                                </Descriptions.Item>
                            )}

                            <Descriptions.Item label="Описание">{tradeRobot.description}</Descriptions.Item>
                        </Descriptions>

                        {tradeRobot.status === TradeRobotStatus.AVAILABLE && (
                            <Form style={{ marginTop: 36, width: "100%" }} form={form} layout="inline">
                                <Form.Item<TradeRobotStartSchemaType>
                                    name="amount"
                                    rules={[TradeRobotStartSchemaRule]}
                                    style={{ width: "100%" }}
                                >
                                    <InputNumber placeholder="Сумма инвестиции" style={{ width: "100%" }} />
                                </Form.Item>
                            </Form>
                        )}
                    </>
                )}
            </Modal>
        </>
    )
}
