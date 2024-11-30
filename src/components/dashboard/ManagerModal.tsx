"use client"

import { User, UserRole, UserStatus } from "@prisma/client"
import { Button, Descriptions, Form, Input, InputNumber, Modal, Select } from "antd"
import { useEffect } from "react"

import { UserRolesTags, UserStatusTag } from "../misc/Tags"
import { ManagerDetailsSchemaRule, ManagerDetailsSchemaType } from "@/schemas/dashboard/manager.schemas"

type ManagerModalProps = {
    open: boolean
    manager?: Partial<User>
    isEditing?: boolean
    loading?: boolean
    onClose: () => void
    onUpdate: (user: ManagerDetailsSchemaType) => void
    onCreate: (user: ManagerDetailsSchemaType) => void
}

const ManagerModal: React.FC<ManagerModalProps> = ({
    open,
    manager = {
        username: "",
        email: "",
        roles: [UserRole.MANAGER],
        status: UserStatus.ACTIVE,
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
            form.setFieldsValue(manager)
        }
    }, [manager, open])

    return (
        <Modal
            open={open}
            title={isEditing ? "Редактировать менеджера" : "Добавить менеджера"}
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
                    <Descriptions.Item label="Юзернейм">
                        <Form.Item<ManagerDetailsSchemaType>
                            name="username"
                            rules={[ManagerDetailsSchemaRule]}
                            style={{ marginBottom: 0 }}
                        >
                            <Input />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Email">
                        <Form.Item<ManagerDetailsSchemaType>
                            name="email"
                            rules={[ManagerDetailsSchemaRule]}
                            style={{ marginBottom: 0 }}
                        >
                            <Input />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Пароль">
                        <Form.Item<ManagerDetailsSchemaType>
                            name="password"
                            rules={[ManagerDetailsSchemaRule]}
                            style={{ marginBottom: 0 }}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Роли">
                        <Form.Item<ManagerDetailsSchemaType>
                            name="roles"
                            rules={[ManagerDetailsSchemaRule]}
                            style={{ marginBottom: 0 }}
                        >
                            <Select mode="multiple">
                                {Object.values(UserRole).map((role) => (
                                    <Select.Option key={role} value={role}>
                                        <UserRolesTags roles={[role]} />
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Статус">
                        <Form.Item name="status" rules={[ManagerDetailsSchemaRule]} style={{ marginBottom: 0 }}>
                            <Select>
                                {Object.values(UserStatus).map((status) => (
                                    <Select.Option key={status} value={status}>
                                        <UserStatusTag status={status} />
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Descriptions.Item>
                </Descriptions>
            </Form>
        </Modal>
    )
}

export default ManagerModal
