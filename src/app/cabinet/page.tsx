"use server"

import { TransactionType } from "@prisma/client"
import { Tabs } from "antd"
import { Content } from "antd/es/layout/layout"

import DepositCard from "@/components/cabinet/DepositCard"
import TransactionsTable from "@/components/cabinet/TransactionsTable"
import UserTradeStats from "@/components/cabinet/UserTradeStats"
import WithdrawalCard from "@/components/cabinet/WithdrawalCard"
import PageContent from "@/components/layout/PageContent"
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
        <Content style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
            <UserTradeStats />

            <PageContent>
                <Tabs
                    defaultActiveKey={initialTab}
                    type="card"
                    items={[
                        {
                            key: "deposit",
                            label: "Пополнение",
                            children: (
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div style={{ marginRight: 10, width: "100%" }}>
                                        <TransactionsTable
                                            transactions={transactions.filter(
                                                (tx) => tx.type === TransactionType.DEPOSIT
                                            )}
                                        />
                                    </div>

                                    <DepositCard wallets={depositWallets} />
                                </div>
                            ),
                        },
                        {
                            key: "withdrawal",
                            label: "Вывод",
                            children: (
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div style={{ marginRight: 10, width: "100%" }}>
                                        <TransactionsTable
                                            transactions={transactions.filter(
                                                (tx) => tx.type === TransactionType.WITHDRAWAL
                                            )}
                                        />
                                    </div>

                                    <WithdrawalCard cryptos={withdrawableCryptos} />
                                </div>
                            ),
                        },
                    ]}
                />
            </PageContent>
        </Content>
    )
}

export default Cabinet
