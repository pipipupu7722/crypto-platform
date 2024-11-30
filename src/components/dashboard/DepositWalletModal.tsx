"use client"

import { DepositWalletStatus } from "@prisma/client"
import { Button, Descriptions, Form, Input, Modal, Select } from "antd"
import { useEffect } from "react"

import { DepositWalletStatusTag } from "../misc/Tags"
import { DepositWalletSchemaRule, DepositWalletSchemaType } from "@/schemas/dashboard/depositWallets.schemas"

type DepositWalletModalProps = {
    open: boolean
    wallet?: Partial<DepositWalletSchemaType>
    isEditing?: boolean
    loading?: boolean
    onClose: () => void
    onUpdate: (depositWallet: DepositWalletSchemaType) => void
    onCreate: (depositWallet: DepositWalletSchemaType) => void
}

const DepositWalletModal: React.FC<DepositWalletModalProps> = ({
    open,
    wallet = {
        crypto: "",
        wallet: "",
        status: DepositWalletStatus.ACTIVE,
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
            form.setFieldsValue(wallet)
        }
    }, [wallet, open])

    return (
        <Modal
            open={open}
            title={isEditing ? "Редактировать кошелек" : "Добавить кошелек"}
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
                                onUpdate(values)
                            } else {
                                onCreate(values)
                            }
                        })
                    }}
                >
                    {isEditing ? "Принять" : "Создать"}
                </Button>,
                <Button key="cancel" onClick={onClose}>
                    Отмена
                </Button>,
            ]}
        >
            <Form form={form} layout="horizontal">
                <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Криптовалюта">
                        <Form.Item<DepositWalletSchemaType>
                            name="crypto"
                            style={{ marginBottom: 0 }}
                            rules={[DepositWalletSchemaRule]}
                        >
                            <Input />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Адрес">
                        <Form.Item<DepositWalletSchemaType>
                            name="wallet"
                            style={{ marginBottom: 0 }}
                            rules={[DepositWalletSchemaRule]}
                        >
                            <Input />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Статус">
                        <Form.Item<DepositWalletSchemaType>
                            name="status"
                            style={{ marginBottom: 0 }}
                            rules={[DepositWalletSchemaRule]}
                        >
                            <Select>
                                {Object.values(DepositWalletStatus).map((status) => (
                                    <Select.Option key={status} value={status}>
                                        <DepositWalletStatusTag status={status} />
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Описание">
                        <Form.Item<DepositWalletSchemaType>
                            name="description"
                            style={{ marginBottom: 0 }}
                            rules={[DepositWalletSchemaRule]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Descriptions.Item>
                </Descriptions>
            </Form>
        </Modal>
    )
}

export default DepositWalletModal
