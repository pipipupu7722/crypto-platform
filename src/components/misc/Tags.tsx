import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ContainerOutlined,
    SyncOutlined,
} from "@ant-design/icons"
import {
    DepositWalletStatus,
    TransactionStatus,
    TransactionType,
    UserAuthLog,
    UserAuthLogType,
    UserRole,
    UserStatus,
} from "@prisma/client"
import { Tag } from "antd"

import { hasRole } from "@/lib/helpers"

export const UserStatusTag = ({ status }: { status: UserStatus }) => {
    if (status === UserStatus.PENDING) {
        return (
            <Tag icon={<ClockCircleOutlined spin />} color="default" style={{ width: "fit-content" }}>
                Ждет проверки
            </Tag>
        )
    } else if (status === UserStatus.ACTIVE) {
        return (
            <Tag icon={<CheckCircleOutlined />} color="success" style={{ width: "fit-content" }}>
                Активен
            </Tag>
        )
    } else if (status === UserStatus.BANNED) {
        return (
            <Tag icon={<CloseCircleOutlined />} color="error" style={{ width: "fit-content" }}>
                Заблокирован
            </Tag>
        )
    } else if (status === UserStatus.REJECTED) {
        return (
            <Tag icon={<CloseCircleOutlined />} color="error" style={{ width: "fit-content" }}>
                Отклонен
            </Tag>
        )
    }
}

export const UserRolesTags = ({ roles }: { roles: UserRole[] }) => {
    return (
        <>
            {roles.includes(UserRole.ADMIN) && (
                <Tag color="volcano" style={{ width: "fit-content" }}>
                    Админ
                </Tag>
            )}
            {roles.includes(UserRole.MANAGER) && (
                <Tag color="lime" style={{ width: "fit-content" }}>
                    Менеджер
                </Tag>
            )}
            {roles.includes(UserRole.USER) && (
                <Tag color="blue" style={{ width: "fit-content" }}>
                    Пользователь
                </Tag>
            )}
        </>
    )
}

export const UserAuthLogTypeTag = ({ type }: { type: UserAuthLogType }) => {
    if (type === UserAuthLogType.LOGIN) {
        return (
            <Tag color="cyan" style={{ width: "fit-content" }}>
                Вход
            </Tag>
        )
    } else if (type === UserAuthLogType.REFRESH) {
        return (
            <Tag color="gold" style={{ width: "fit-content" }}>
                Доступ
            </Tag>
        )
    }
}

export const TransactionTypeTag = ({ type }: { type: TransactionType }) => {
    if (type === TransactionType.DEPOSIT) {
        return (
            <Tag color="gold" style={{ width: "fit-content" }}>
                <ArrowDownOutlined /> Пополнение
            </Tag>
        )
    } else if (type === TransactionType.WITHDRAWAL) {
        return (
            <Tag color="green" style={{ width: "fit-content" }}>
                <ArrowUpOutlined /> Вывод
            </Tag>
        )
    }
}

export const TransactionStatusTag = ({ status }: { status: TransactionStatus }) => {
    if (status === TransactionStatus.PENDING) {
        return (
            <Tag icon={<SyncOutlined spin />} color="processing" style={{ width: "fit-content" }}>
                В обработке
            </Tag>
        )
    } else if (status === TransactionStatus.COMPLETE) {
        return (
            <Tag icon={<CheckCircleOutlined />} color="success" style={{ width: "fit-content" }}>
                Выполнен
            </Tag>
        )
    } else if (status === TransactionStatus.CANCELLED) {
        return (
            <Tag icon={<CloseCircleOutlined />} color="error" style={{ width: "fit-content" }}>
                Отменен
            </Tag>
        )
    }
}

export const DepositWalletStatusTag = ({ status }: { status: DepositWalletStatus }) => {
    if (status === DepositWalletStatus.ACTIVE) {
        return (
            <Tag icon={<CheckCircleOutlined />} color="success" style={{ width: "fit-content" }}>
                Активен
            </Tag>
        )
    } else if (status === DepositWalletStatus.INACTIVE) {
        return (
            <Tag icon={<CloseCircleOutlined spin />} color="error" style={{ width: "fit-content" }}>
                Неактивен
            </Tag>
        )
    } else if (status === DepositWalletStatus.ARCHIVED) {
        return (
            <Tag icon={<ContainerOutlined />} color="default" style={{ width: "fit-content" }}>
                Архивирован
            </Tag>
        )
    }
}
