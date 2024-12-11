"use server"

import { Tabs } from "antd"
import { Content } from "antd/es/layout/layout"

import UserTradeStats from "@/components/cabinet/UserTradeStats"
import DepositTab from "@/components/cabinet/tabs/DepositTab"
import WithdrawalTab from "@/components/cabinet/tabs/WithdrawalTab"
import PageContent from "@/components/layout/PageContent"
import PageContentWrapper from "@/components/layout/PageContentWrapper"
import { cryptocurrenciesService } from "@/lib/server/services/cryptocurrencies.service"
import { depositWalletsService } from "@/lib/server/services/depositWallets.service"
import { transactionService } from "@/lib/server/services/transactions.service"
import { getSessionPayload } from "@/lib/server/session"

const Cabinet = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) => {
    const initialTab = (await searchParams).tab ?? "deposit"

    const session = await getSessionPayload()

    const transactions = await transactionService.getUserTransactions(session.uid)
    const depositWallets = await depositWalletsService.getActiveByUser(session.uid)
    const withdrawableCryptos = await cryptocurrenciesService.getWithdrawable()

    return (
        <PageContentWrapper>
            <UserTradeStats />

            <PageContent>
                <Tabs
                    defaultActiveKey={initialTab}
                    type="card"
                    items={[
                        {
                            key: "deposit",
                            label: "Пополнение",
                            children: <DepositTab transactions={transactions} wallets={depositWallets} />,
                        },
                        {
                            key: "withdrawal",
                            label: "Вывод",
                            children: <WithdrawalTab transactions={transactions} cryptos={withdrawableCryptos} />,
                        },
                    ]}
                />
            </PageContent>
        </PageContentWrapper>
    )
}

export default Cabinet
