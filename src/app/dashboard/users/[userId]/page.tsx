"use server"

import { Tabs } from "antd"
import { notFound } from "next/navigation"

import DepositWalletsTab from "@/components/dashboard/tabs/DepositWalletsTab"
import TransactionsTab from "@/components/dashboard/tabs/TransactionsTab"
import UserDetailsTab from "@/components/dashboard/tabs/UserDetailsTab"
import PageContent from "@/components/layout/PageContent"
import { cryptocurrenciesService } from "@/lib/server/services/cryptocurrencies.service"
import { depositWalletsService } from "@/lib/server/services/depositWallets.service"
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
    const user = await usersService.findById(userId)

    if (!user) {
        return notFound()
    }

    const cryptocurrencies = await cryptocurrenciesService.getAll()
    const depositWallets = await depositWalletsService.getAll()
    const transactions = await transactionService.getUserTransactions(userId)

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
                        key: "addresses",
                        label: "Адреса для пополнения",
                        children: <DepositWalletsTab initialAddresses={depositWallets} />,
                    },
                ]}
            />
        </PageContent>
    )
}

export default User
