"use client"

import { Strategy, StrategyStatus } from "@prisma/client"
import { Button, Descriptions, Form, InputNumber, Modal, Table, TableProps } from "antd"
import { format } from "date-fns"
import { useState } from "react"

import { startStrategy } from "@/actions/cabinet/strategy"
import ClickToCopy from "@/components/misc/ClickToCopy"
import { StrategyStatusTag } from "@/components/misc/Tags"
import { useNotify } from "@/providers/NotificationProvider"
import { StrategyStartSchemaRule, StrategyStartSchemaType } from "@/schemas/cabinet/strategy.schemas"

export default function StrategiesTab({ initialStrategies }: { initialStrategies: Strategy[] }) {
    const [form] = Form.useForm<StrategyStartSchemaType>()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalLoading, setIsModalLoading] = useState(false)
    const [strategies, setStrategies] = useState(initialStrategies)
    const [strategy, setStrategy] = useState<Strategy | undefined>(undefined)

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
            render: (_, rec) => (rec.startedAt ? `${rec.invested.toFixed(2)}$ / ${rec.profit.toFixed(2)}$` : "N/A"),
        },
        {
            title: "PnL",
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
            title: "Дата закрытия",
            key: "closesAt",
            width: 150,
            render: (_, rec) => <>{format(new Date(rec.closesAt), "dd-MM-yyyy")}</>,
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
                        setStrategy(rec)
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
            <Table<Strategy>
                columns={columns}
                pagination={false}
                rowKey={(row) => row.id}
                dataSource={strategies}
                style={{ height: "100%" }}
            />

            <Modal
                open={isModalOpen}
                title={"О стратегии"}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    strategy?.status === StrategyStatus.AVAILABLE && (
                        <Button
                            key="submit"
                            type="primary"
                            loading={isModalLoading}
                            onClick={() => {
                                setIsModalLoading(true)
                                form.validateFields()
                                    .then((values) => startStrategy(strategy?.id, values.amount))
                                    .then((res) => {
                                        if (res.success) {
                                            const { success, ...updated } = res
                                            setStrategies(
                                                strategies.map((row) => (row.id === updated.id ? updated : row))
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
                {strategy && (
                    <>
                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label="Название">{strategy.name}</Descriptions.Item>

                            <Descriptions.Item label="Доходность">
                                {`${(strategy.fakeProfitMin * 100).toFixed(0)}% / ${(strategy.fakeProfitMax * 100).toFixed(0)}%`}
                            </Descriptions.Item>

                            {strategy.startedAt && (
                                <Descriptions.Item label="Инвестиция">
                                    {strategy.invested.toFixed(2)} $
                                </Descriptions.Item>
                            )}

                            {strategy.startedAt && (
                                <Descriptions.Item label="Прибыль">{strategy.profit.toFixed(2)} $</Descriptions.Item>
                            )}

                            <Descriptions.Item label="Статус">
                                {<StrategyStatusTag status={strategy.status} />}
                            </Descriptions.Item>

                            {strategy.createdAt && (
                                <Descriptions.Item label="Дата добавления">
                                    {format(strategy.createdAt, "dd-MM-yyyy")}
                                </Descriptions.Item>
                            )}

                            {strategy.startedAt && (
                                <Descriptions.Item label="Дата старта">
                                    {format(strategy.startedAt, "dd-MM-yyyy")}
                                </Descriptions.Item>
                            )}

                            {strategy.closesAt && !strategy.closedAt && (
                                <Descriptions.Item label="Дата закрытия">
                                    {format(strategy.closesAt, "dd-MM-yyyy")}
                                </Descriptions.Item>
                            )}

                            {strategy.closedAt && (
                                <Descriptions.Item label="Дата закрытия">
                                    {format(strategy.closedAt, "dd-MM-yyyy")}
                                </Descriptions.Item>
                            )}

                            <Descriptions.Item label="Описание">{strategy.description}</Descriptions.Item>
                        </Descriptions>

                        {strategy.status === StrategyStatus.AVAILABLE && (
                            <Form style={{ marginTop: 36, width: "100%" }} form={form} layout="inline">
                                <Form.Item<StrategyStartSchemaType>
                                    name="amount"
                                    rules={[StrategyStartSchemaRule]}
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
