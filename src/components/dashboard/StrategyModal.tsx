"use client"

import { Strategy, StrategyStatus } from "@prisma/client"
import { Button, DatePicker, Descriptions, Form, Input, InputNumber, Modal } from "antd"
import { format } from "date-fns"
import { useEffect } from "react"

import DatePickerUtc from "../misc/DatePickerUtc"
import { StrategyStatusTag } from "../misc/Tags"
import { StrategySchemaRule, StrategySchemaType } from "@/schemas/dashboard/strategy.schemas"

type StrategyModalProps = {
    open: boolean
    strategy?: Partial<Strategy>
    isEditing?: boolean
    loading?: boolean
    onClose: () => void
    onUpdate: (strategy: StrategySchemaType) => void
    onCreate: (strategy: StrategySchemaType) => void
}

const StrategyModal: React.FC<StrategyModalProps> = ({
    open,
    strategy = {
        name: "BTC / ETH / TRX",
        fakeProfitMin: 0.1,
        fakeProfitMax: 0.5,
        realProfitMin: 0.1,
        realProfitMax: 0.5,
        status: StrategyStatus.AVAILABLE,
    },
    isEditing = false,
    loading = false,
    onClose,
    onUpdate,
    onCreate,
}) => {
    const [form] = Form.useForm()

    useEffect(() => {
        if (open) {
            form.setFieldsValue(strategy)
        }
    }, [strategy, open])

    return (
        <Modal
            open={open}
            title={isEditing ? "Редактирование стратегии" : "Создание стратегии"}
            onCancel={() => {
                form.resetFields()
                onClose()
            }}
            footer={[
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={() => {
                        form.validateFields().then((values) => {
                            if (isEditing) {
                                onUpdate(values as StrategySchemaType)
                            } else {
                                onCreate(values as StrategySchemaType)
                            }
                        })
                    }}
                >
                    {isEditing ? "Принять" : "Создать"}
                </Button>,
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
            ]}
        >
            <Form form={form} layout="horizontal">
                <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Название">
                        <Form.Item<StrategySchemaType>
                            name="name"
                            style={{ marginBottom: 0 }}
                            rules={[StrategySchemaRule]}
                        >
                            <Input />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Fake PnL Min">
                        <Form.Item<StrategySchemaType>
                            name="fakeProfitMin"
                            style={{ marginBottom: 0 }}
                            rules={[StrategySchemaRule]}
                        >
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Fake PnL Max">
                        <Form.Item<StrategySchemaType>
                            name="fakeProfitMax"
                            style={{ marginBottom: 0 }}
                            rules={[StrategySchemaRule]}
                        >
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Real PnL Min">
                        <Form.Item<StrategySchemaType>
                            name="realProfitMin"
                            style={{ marginBottom: 0 }}
                            rules={[StrategySchemaRule]}
                        >
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Real PnL Max">
                        <Form.Item<StrategySchemaType>
                            name="realProfitMax"
                            style={{ marginBottom: 0 }}
                            rules={[StrategySchemaRule]}
                        >
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Описание">
                        <Form.Item<StrategySchemaType>
                            name="description"
                            style={{ marginBottom: 0 }}
                            rules={[StrategySchemaRule]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Дата закрытия">
                        <Form.Item
                            name={strategy.closesAt ? undefined : "closesAt"}
                            style={{ marginBottom: 0 }}
                            rules={[{ required: true, message: "Выберите дату" }]}
                        >
                            {strategy?.closesAt ? (
                                format(strategy.closesAt, "dd-MM-yyyy")
                            ) : (
                                <DatePickerUtc style={{ width: "100%" }} />
                            )}
                        </Form.Item>
                    </Descriptions.Item>

                    {strategy.status && (
                        <Descriptions.Item label="Статус">
                            <Form.Item style={{ marginBottom: 0 }}>
                                {<StrategyStatusTag status={strategy.status} />}
                            </Form.Item>
                        </Descriptions.Item>
                    )}

                    {strategy.createdAt && (
                        <Descriptions.Item label="Дата создания">
                            <Form.Item style={{ marginBottom: 0 }}>
                                {format(strategy.createdAt, "dd-MM-yyyy HH:mm:ss")}
                            </Form.Item>
                        </Descriptions.Item>
                    )}

                    {strategy.startedAt && (
                        <Descriptions.Item label="Дата начала">
                            <Form.Item style={{ marginBottom: 0 }}>
                                {format(strategy.startedAt, "dd-MM-yyyy HH:mm:ss")}
                            </Form.Item>
                        </Descriptions.Item>
                    )}

                    {strategy.closedAt && (
                        <Descriptions.Item label="Дата закрытия">
                            <Form.Item style={{ marginBottom: 0 }}>
                                {format(strategy.closedAt, "dd-MM-yyyy HH:mm:ss")}
                            </Form.Item>
                        </Descriptions.Item>
                    )}
                </Descriptions>
            </Form>
        </Modal>
    )
}

export default StrategyModal
