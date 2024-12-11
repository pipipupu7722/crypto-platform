"use client"

import { QuestionCircleOutlined } from "@ant-design/icons"
import { User, UserStatus } from "@prisma/client"
import { Alert, Button, Descriptions, Form, Input, Popconfirm } from "antd"
import PhoneInput from "antd-phone-input"
import { format } from "date-fns"
import { parsePhoneNumber } from "libphonenumber-js"
import { notFound } from "next/navigation"
import { useState } from "react"

import CountryFlag from "../../misc/CountryFlag"
import { UserStatusTag } from "../../misc/Tags"
import {
    approveUserRegistration,
    banUser,
    rejectUserRegistration,
    resetPassword,
    unbanUser,
    updateUserDetails,
} from "@/actions/dashboard/user"
import ClickToCopy from "@/components/misc/ClickToCopy"
import { ServerActionResponse } from "@/lib/types"
import { useNotify } from "@/providers/NotifyProvider"
import { UserDetailsSchemaRule, UserDetailsSchemaType } from "@/schemas/dashboard/user.schemas"

const UserDetailsTab = ({ initialUser }: { initialUser: User }) => {
    const [newPassword, setNewPassword] = useState<null | string>(null)
    const [isActionPending, setIsActionPending] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [user, setUser] = useState(initialUser)
    const [form] = Form.useForm()

    const { notify } = useNotify()

    if (!user) {
        return notFound()
    }

    const toggleEditMode = () => {
        if (isEditing) form.resetFields()
        setIsEditing(!isEditing)
    }

    const wrap = (action: () => Promise<ServerActionResponse<User>>) => {
        setIsActionPending(true)
        action()
            .then((res) => (res.success ? setUser(res) : notify.error({ message: res.error })))
            .finally(() => setIsActionPending(false))
    }

    return (
        <div>
            <Form form={form} layout="vertical" initialValues={user}>
                <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="ID">
                        <Form.Item style={{ marginBottom: 0 }} name="id">
                            {user.id}
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Email">
                        <Form.Item<UserDetailsSchemaType>
                            style={{ marginBottom: 0 }}
                            name="email"
                            rules={[UserDetailsSchemaRule]}
                        >
                            {isEditing ? <Input /> : user.email}
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Юзернейм">
                        <Form.Item<UserDetailsSchemaType>
                            style={{ marginBottom: 0 }}
                            name="username"
                            rules={[UserDetailsSchemaRule]}
                        >
                            {isEditing ? <Input /> : user.username}
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Имя">
                        <Form.Item<UserDetailsSchemaType>
                            style={{ marginBottom: 0 }}
                            name="firstName"
                            rules={[UserDetailsSchemaRule]}
                        >
                            {isEditing ? <Input /> : (user.firstName ?? "N/A")}
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Фамилия">
                        <Form.Item<UserDetailsSchemaType>
                            style={{ marginBottom: 0 }}
                            name="lastName"
                            rules={[UserDetailsSchemaRule]}
                        >
                            {isEditing ? <Input /> : (user.lastName ?? "N/A")}
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Баланс">
                        <Form.Item<UserDetailsSchemaType>
                            style={{ marginBottom: 0 }}
                            name="balance"
                            rules={[UserDetailsSchemaRule]}
                        >
                            {isEditing ? <Input /> : (user.balance.toFixed(2) ?? "N/A")}
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Торговый баланс">
                        <Form.Item<UserDetailsSchemaType>
                            style={{ marginBottom: 0 }}
                            name="tradingBalance"
                            rules={[UserDetailsSchemaRule]}
                        >
                            {isEditing ? <Input /> : (user.tradingBalance.toFixed(2) ?? "N/A")}
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="На вывод">
                        <Form.Item<UserDetailsSchemaType>
                            style={{ marginBottom: 0 }}
                            name="withdrawnFunds"
                            rules={[UserDetailsSchemaRule]}
                        >
                            {isEditing ? <Input /> : (user.withdrawnFunds.toFixed(2) ?? "N/A")}
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Номер телефона">
                        <Form.Item<UserDetailsSchemaType>
                            style={{ marginBottom: 0 }}
                            name="phone"
                            rules={[
                                {
                                    validator: (_, { valid }) => {
                                        if (valid(true)) return Promise.resolve()
                                        return Promise.reject("Invalid phone number")
                                    },
                                },
                            ]}
                        >
                            {isEditing ? (
                                <PhoneInput />
                            ) : (
                                <>
                                    {user.country ? <CountryFlag country={user.country} /> : "N/A"}
                                    &nbsp;
                                    {user.phone ? parsePhoneNumber(user.phone).formatInternational() : "N/A"}
                                </>
                            )}
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Статус">
                        <Form.Item style={{ marginBottom: 0 }}>
                            <UserStatusTag status={user.status} />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Дата регистрации">
                        <Form.Item style={{ marginBottom: 0 }} name="createdAt">
                            {format(user.createdAt, "dd-MM-yyyy HH:mm:ss")}
                        </Form.Item>
                    </Descriptions.Item>
                </Descriptions>
            </Form>

            {newPassword && (
                <Alert
                    showIcon
                    closable
                    onClose={() => setNewPassword(null)}
                    type="success"
                    message="Новый пароль: "
                    style={{ marginTop: 10 }}
                    action={<ClickToCopy>{newPassword}</ClickToCopy>}
                />
            )}

            <div style={{ textAlign: "right", marginTop: 10 }}>
                {isEditing ? (
                    <>
                        <Button
                            type="primary"
                            loading={isActionPending}
                            style={{ marginRight: 8 }}
                            onClick={() =>
                                form.validateFields().then((details) => {
                                    setIsActionPending(true)
                                    updateUserDetails(user.id, details)
                                        .then((res) =>
                                            res.success ? setUser(res) : notify.error({ message: res.error })
                                        )
                                        .finally(() => {
                                            setIsActionPending(false)
                                            setIsEditing(false)
                                        })
                                })
                            }
                        >
                            Применить
                        </Button>
                        <Button onClick={toggleEditMode}>Отмена</Button>
                    </>
                ) : (
                    <>
                        {(user.status === UserStatus.PENDING || user.status === UserStatus.REJECTED) && (
                            <Button
                                color="primary"
                                variant="outlined"
                                loading={isActionPending}
                                style={{ marginRight: 8 }}
                                onClick={() => wrap(() => approveUserRegistration(user.id))}
                            >
                                Подтвердить регистрацию
                            </Button>
                        )}
                        {user.status === UserStatus.PENDING && (
                            <Button
                                danger
                                loading={isActionPending}
                                style={{ marginRight: 8 }}
                                onClick={() => wrap(() => rejectUserRegistration(user.id))}
                            >
                                Отклонить регистрацию
                            </Button>
                        )}

                        <Popconfirm
                            title="Сбросить пароль?"
                            description="Это действие невозможно отменить"
                            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                            onConfirm={() => {
                                setIsActionPending(true)
                                resetPassword(user.id)
                                    .then((res) =>
                                        res.success
                                            ? setNewPassword(res.newPassword)
                                            : notify.error({ message: res.error })
                                    )
                                    .finally(() => setIsActionPending(false))
                            }}
                        >
                            <Button danger loading={isActionPending} style={{ marginRight: 8 }}>
                                Сбросить пароль
                            </Button>
                        </Popconfirm>

                        {user.status === UserStatus.ACTIVE && (
                            <Button
                                danger
                                loading={isActionPending}
                                style={{ marginRight: 8 }}
                                onClick={() => wrap(() => banUser(user.id))}
                            >
                                Заблокировать
                            </Button>
                        )}

                        {user.status === UserStatus.BANNED && (
                            <Button
                                danger
                                loading={isActionPending}
                                variant="outlined"
                                style={{ marginRight: 8 }}
                                onClick={() => wrap(() => unbanUser(user.id))}
                            >
                                Разблокировать
                            </Button>
                        )}

                        <Button type="default" onClick={toggleEditMode}>
                            Редактировать
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}

export default UserDetailsTab
