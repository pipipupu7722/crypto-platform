"use server"

import { Tabs } from "antd"
import { notFound } from "next/navigation"

import AuthLogTab from "@/components/dashboard/tabs/AuthLogTab"
import DepositWalletsTab from "@/components/dashboard/tabs/DepositWalletsTab"
import TransactionsTab from "@/components/dashboard/tabs/TransactionsTab"
import UserDetailsTab from "@/components/dashboard/tabs/UserDetailsTab"
import PageContent from "@/components/layout/PageContent"
import { cryptocurrenciesService } from "@/lib/server/services/cryptocurrencies.service"
import { depositWalletsService } from "@/lib/server/services/depositWallets.service"
import { sessionsService } from "@/lib/server/services/sessions.service"
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
                        key: "wallets",
                        label: "Кошельки для пополнения",
                        children: <DepositWalletsTab initialAddresses={depositWallets} />,
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
