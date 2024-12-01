"use client"

import { css } from "@emotion/css"
import { Cryptocurrency, Transaction, TransactionType } from "@prisma/client"

import TransactionsTable from "./TransactionsTable"
import WithdrawalCard from "./WithdrawalCard"
import { breakpoints } from "@/theme"

export default function DepositTab({
    transactions,
    cryptos,
}: {
    transactions: Transaction[]
    cryptos: Cryptocurrency[]
}) {
    return (
        <div
            className={css`
                display: flex;
                justify-content: space-between;

                @media screen and (max-width: ${breakpoints.md}) {
                    flex-direction: column-reverse;
                    justify-content: start;
                }
            `}
        >
            <div
                className={css`
                    margin-right: 10px;
                    width: 100%;

                    @media screen and (max-width: ${breakpoints.md}) {
                        margin-top: 24px;
                    }
                `}
            >
                <TransactionsTable transactions={transactions.filter((tx) => tx.type === TransactionType.WITHDRAWAL)} />
            </div>

            <WithdrawalCard cryptos={cryptos} />
        </div>
    )
}
