"use client"

import { css } from "@emotion/css"
import { DepositWallet, Transaction, TransactionType } from "@prisma/client"

import DepositCard from "./DepositCard"
import TransactionsTable from "./TransactionsTable"
import { breakpoints } from "@/theme"

export default function DepositTab({
    transactions,
    wallets,
}: {
    transactions: Transaction[]
    wallets: DepositWallet[]
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
                <TransactionsTable transactions={transactions.filter((tx) => tx.type === TransactionType.DEPOSIT)} />
            </div>

            <DepositCard wallets={wallets} />
        </div>
    )
}
