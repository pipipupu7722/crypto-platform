"use server"

import { Tabs } from "antd"
import { notFound } from "next/navigation"

import AuthLogTab from "@/components/dashboard/tabs/AuthLogTab"
import DepositWalletsTab from "@/components/dashboard/tabs/DepositWalletsTab"
import DocumentsTab from "@/components/dashboard/tabs/DocumentsTab"
import NotificationTab from "@/components/dashboard/tabs/NotificationsTab"
import StrategiesTab from "@/components/dashboard/tabs/StrategiesTab"
import TradeRobotsTab from "@/components/dashboard/tabs/TradeRobotsTab"
import TransactionsTab from "@/components/dashboard/tabs/TransactionsTab"
import UserDetailsTab from "@/components/dashboard/tabs/UserDetailsTab"
import PageContent from "@/components/layout/PageContent"
import { cryptocurrenciesService } from "@/lib/server/services/cryptocurrencies.service"
import { depositWalletsService } from "@/lib/server/services/depositWallets.service"
import { sessionsService } from "@/lib/server/services/sessions.service"
import { strategiesService } from "@/lib/server/services/strategies.service"
import { tradeRobotsService } from "@/lib/server/services/tradeRobots.service"
import { transactionService } from "@/lib/server/services/transactions.service"
import { usersService } from "@/lib/server/services/users.service"

const User = async ({
    params,
    searchParams,
}: {
    params: Promise<{ userId: string }>
    searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
    const tab = (await searchParams).tab ?? "details"
    const userId = (await params).userId
    const user = await usersService.getById(userId)

    if (!user) {
        return notFound()
    }

    const transactions = await transactionService.getUserTransactions(userId)
    const strategies = await strategiesService.getAllByUser(userId)
    const tradeRobots = await tradeRobotsService.getAllByUser(userId)
    const cryptocurrencies = await cryptocurrenciesService.getAll()
    const userAuthLogs = await sessionsService.getUserAuthLogs(user.id)
    const depositWallets = await depositWalletsService.getByUser(user.id)

    return (
        <PageContent>
            <Tabs
                defaultActiveKey={tab}
                items={[
                    {
                        key: "details",
                        label: "Профиль",
                        children: <UserDetailsTab initialUser={user} />,
                    },
                    {
                        key: "transactions",
                        label: "Транзакции",
                        children: (
                            <TransactionsTab
                                userId={userId}
                                depositWallets={depositWallets}
                                cryptocurrencies={cryptocurrencies}
                                initialTransactions={transactions}
                            />
                        ),
                    },
                    {
                        key: "strategies",
                        label: "Стратегии",
                        children: <StrategiesTab userId={userId} initialStrategies={strategies} />,
                    },
                    {
                        key: "tradeRobots",
                        label: "Робот",
                        children: <TradeRobotsTab userId={userId} initialTradeRobots={tradeRobots} />,
                    },
                    {
                        key: "wallets",
                        label: "Кошельки",
                        children: (
                            <DepositWalletsTab
                                userId={userId}
                                cryptocurrencies={cryptocurrencies}
                                initialAddresses={depositWallets}
                            />
                        ),
                    },
                    {
                        key: "documents",
                        label: "Документы",
                        children: <DocumentsTab targetUser={user} />,
                    },
                    {
                        key: "notifications",
                        label: "Нотификации",
                        children: <NotificationTab userId={user.id} />,
                    },
                    {
                        key: "authlog",
                        label: "История доступа",
                        children: <AuthLogTab initial={userAuthLogs} />,
                    },
                ]}
            />
        </PageContent>
    )
}

export default User
