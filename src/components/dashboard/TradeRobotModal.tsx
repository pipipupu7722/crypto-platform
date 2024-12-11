"use client"

import { TradeRobot, TradeRobotStatus } from "@prisma/client"
import { Button, DatePicker, Descriptions, Form, Input, InputNumber, Modal } from "antd"
import { format } from "date-fns"
import { useEffect } from "react"

import DatePickerUtc from "../misc/DatePickerUtc"
import { TradeRobotStatusTag } from "../misc/Tags"
import { TradeRobotSchemaRule, TradeRobotSchemaType } from "@/schemas/dashboard/tradeRobot.schemas"

type TradeRobotModalProps = {
    open: boolean
    tradeRobot?: Partial<TradeRobot>
    isEditing?: boolean
    loading?: boolean
    onClose: () => void
    onUpdate: (tradeRobot: TradeRobotSchemaType) => void
    onCreate: (tradeRobot: TradeRobotSchemaType) => void
}

const TradeRobotModal: React.FC<TradeRobotModalProps> = ({
    open,
    tradeRobot = {
        name: "BTC / ETH / TRX",
        fakeProfitMin: 0.1,
        fakeProfitMax: 0.5,
        realProfitMin: 0.1,
        realProfitMax: 0.5,
        status: TradeRobotStatus.AVAILABLE,
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
            form.setFieldsValue(tradeRobot)
        }
    }, [tradeRobot, open])

    return (
        <Modal
            open={open}
            title={isEditing ? "Редактирование торгового робота" : "Создание торгового робота"}
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
                                onUpdate(values as TradeRobotSchemaType)
                            } else {
                                onCreate(values as TradeRobotSchemaType)
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
                        <Form.Item<TradeRobotSchemaType>
                            name="name"
                            style={{ marginBottom: 0 }}
                            rules={[TradeRobotSchemaRule]}
                        >
                            <Input />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Fake PnL Min">
                        <Form.Item<TradeRobotSchemaType>
                            name="fakeProfitMin"
                            style={{ marginBottom: 0 }}
                            rules={[TradeRobotSchemaRule]}
                        >
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Fake PnL Max">
                        <Form.Item<TradeRobotSchemaType>
                            name="fakeProfitMax"
                            style={{ marginBottom: 0 }}
                            rules={[TradeRobotSchemaRule]}
                        >
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Real PnL Min">
                        <Form.Item<TradeRobotSchemaType>
                            name="realProfitMin"
                            style={{ marginBottom: 0 }}
                            rules={[TradeRobotSchemaRule]}
                        >
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Real PnL Max">
                        <Form.Item<TradeRobotSchemaType>
                            name="realProfitMax"
                            style={{ marginBottom: 0 }}
                            rules={[TradeRobotSchemaRule]}
                        >
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Описание">
                        <Form.Item<TradeRobotSchemaType>
                            name="description"
                            style={{ marginBottom: 0 }}
                            rules={[TradeRobotSchemaRule]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Дата закрытия">
                        <Form.Item
                            name={tradeRobot.closesAt ? undefined : "closesAt"}
                            style={{ marginBottom: 0 }}
                            rules={[{ required: true, message: "Выберите дату" }]}
                        >
                            {tradeRobot?.closesAt ? (
                                format(tradeRobot.closesAt, "dd-MM-yyyy")
                            ) : (
                                <DatePickerUtc style={{ width: "100%" }} />
                            )}
                        </Form.Item>
                    </Descriptions.Item>

                    {tradeRobot.status && (
                        <Descriptions.Item label="Статус">
                            <Form.Item style={{ marginBottom: 0 }}>
                                {<TradeRobotStatusTag status={tradeRobot.status} />}
                            </Form.Item>
                        </Descriptions.Item>
                    )}

                    {tradeRobot.createdAt && (
                        <Descriptions.Item label="Дата создания">
                            <Form.Item style={{ marginBottom: 0 }}>
                                {format(tradeRobot.createdAt, "dd-MM-yyyy HH:mm:ss")}
                            </Form.Item>
                        </Descriptions.Item>
                    )}

                    {tradeRobot.startedAt && (
                        <Descriptions.Item label="Дата начала">
                            <Form.Item style={{ marginBottom: 0 }}>
                                {format(tradeRobot.startedAt, "dd-MM-yyyy HH:mm:ss")}
                            </Form.Item>
                        </Descriptions.Item>
                    )}

                    {tradeRobot.closedAt && (
                        <Descriptions.Item label="Дата закрытия">
                            <Form.Item style={{ marginBottom: 0 }}>
                                {format(tradeRobot.closedAt, "dd-MM-yyyy HH:mm:ss")}
                            </Form.Item>
                        </Descriptions.Item>
                    )}
                </Descriptions>
            </Form>
        </Modal>
    )
}

export default TradeRobotModal
