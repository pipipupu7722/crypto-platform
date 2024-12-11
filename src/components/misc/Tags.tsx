import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ContainerOutlined,
    PlusCircleOutlined,
    SyncOutlined,
} from "@ant-design/icons"
import { css } from "@emotion/css"
import {
    DepositWalletStatus,
    StrategyStatus,
    TradeRobotStatus,
    TransactionStatus,
    TransactionType,
    UserAuthLogType,
    UserRole,
    UserStatus,
} from "@prisma/client"
import { Tag, TagProps } from "antd"
import { ReactNode } from "react"

const TagWithIcon = ({
    color,
    icon,
    children,
}: {
    color: TagProps["color"]
    icon?: TagProps["icon"]
    children: ReactNode
}) => {
    return (
        <Tag
            icon={icon}
            color={color}
            className={css`
                width: "fit-content";
            `}
        >
            {children}
        </Tag>
    )
}

export const UserStatusTag = ({ status }: { status: UserStatus }) => {
    if (status === UserStatus.PENDING) {
        return (
            <TagWithIcon icon={<ClockCircleOutlined spin />} color="default">
                Ждет проверки
            </TagWithIcon>
        )
    } else if (status === UserStatus.ACTIVE) {
        return (
            <TagWithIcon icon={<CheckCircleOutlined />} color="success">
                Активен
            </TagWithIcon>
        )
    } else if (status === UserStatus.BANNED) {
        return (
            <TagWithIcon icon={<CloseCircleOutlined />} color="error">
                Заблокирован
            </TagWithIcon>
        )
    } else if (status === UserStatus.REJECTED) {
        return (
            <TagWithIcon icon={<CloseCircleOutlined />} color="error">
                Отклонен
            </TagWithIcon>
        )
    }
}

export const UserRolesTags = ({ roles }: { roles: UserRole[] }) => {
    return (
        <>
            {roles.includes(UserRole.ADMIN) && <TagWithIcon color="volcano">Админ</TagWithIcon>}
            {roles.includes(UserRole.MANAGER) && <TagWithIcon color="lime">Менеджер</TagWithIcon>}
            {roles.includes(UserRole.USER) && <TagWithIcon color="blue">Пользователь</TagWithIcon>}
        </>
    )
}

export const UserAuthLogTypeTag = ({ type }: { type: UserAuthLogType }) => {
    if (type === UserAuthLogType.LOGIN) {
        return <TagWithIcon color="cyan">Вход</TagWithIcon>
    } else if (type === UserAuthLogType.REFRESH) {
        return <TagWithIcon color="gold">Доступ</TagWithIcon>
    }
}

export const TransactionTypeTag = ({ type }: { type: TransactionType }) => {
    if (type === TransactionType.DEPOSIT) {
        return (
            <TagWithIcon color="gold">
                <ArrowDownOutlined /> Пополнение
            </TagWithIcon>
        )
    } else if (type === TransactionType.WITHDRAWAL) {
        return (
            <TagWithIcon color="green">
                <ArrowUpOutlined /> Вывод
            </TagWithIcon>
        )
    }
}

export const TransactionStatusTag = ({ status }: { status: TransactionStatus }) => {
    if (status === TransactionStatus.PENDING) {
        return (
            <TagWithIcon icon={<SyncOutlined spin />} color="processing">
                В обработке
            </TagWithIcon>
        )
    } else if (status === TransactionStatus.COMPLETE) {
        return (
            <TagWithIcon icon={<CheckCircleOutlined />} color="success">
                Выполнен
            </TagWithIcon>
        )
    } else if (status === TransactionStatus.CANCELLED) {
        return (
            <TagWithIcon icon={<CloseCircleOutlined />} color="error">
                Отменен
            </TagWithIcon>
        )
    }
}

export const DepositWalletStatusTag = ({ status }: { status: DepositWalletStatus }) => {
    if (status === DepositWalletStatus.ACTIVE) {
        return (
            <TagWithIcon icon={<CheckCircleOutlined />} color="success">
                Активен
            </TagWithIcon>
        )
    } else if (status === DepositWalletStatus.INACTIVE) {
        return (
            <TagWithIcon icon={<CloseCircleOutlined spin />} color="error">
                Неактивен
            </TagWithIcon>
        )
    } else if (status === DepositWalletStatus.ARCHIVED) {
        return (
            <TagWithIcon icon={<ContainerOutlined />} color="default">
                Архивирован
            </TagWithIcon>
        )
    }
}

export const StrategyStatusTag = ({ status }: { status: StrategyStatus }) => {
    if (status === StrategyStatus.ACTIVE) {
        return (
            <TagWithIcon icon={<SyncOutlined spin />} color="processing">
                В работе
            </TagWithIcon>
        )
    } else if (status === StrategyStatus.AVAILABLE) {
        return (
            <TagWithIcon icon={<PlusCircleOutlined />} color="gold">
                Доступна
            </TagWithIcon>
        )
    } else if (status === StrategyStatus.CLOSED) {
        return (
            <TagWithIcon icon={<CheckCircleOutlined />} color="success">
                Закрыта
            </TagWithIcon>
        )
    }
}

export const TradeRobotStatusTag = ({ status }: { status: TradeRobotStatus }) => {
    if (status === TradeRobotStatus.ACTIVE) {
        return (
            <TagWithIcon icon={<SyncOutlined spin />} color="processing">
                В работе
            </TagWithIcon>
        )
    } else if (status === TradeRobotStatus.AVAILABLE) {
        return (
            <TagWithIcon icon={<PlusCircleOutlined />} color="gold">
                Доступна
            </TagWithIcon>
        )
    } else if (status === TradeRobotStatus.CLOSED) {
        return (
            <TagWithIcon icon={<CheckCircleOutlined />} color="success">
                Закрыта
            </TagWithIcon>
        )
    }
}
