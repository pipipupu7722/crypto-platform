"use client"

import { Strategy } from "@prisma/client"
import { Table, TableProps } from "antd"
import { format } from "date-fns"
import { useState } from "react"

import CountUpWithRef from "@/components/misc/CountUpWithRef"
import { StrategyStatusTag } from "@/components/misc/Tags"
import { AppEvents } from "@/lib/events"
import { useNotify } from "@/providers/NotifyProvider"
import { sseReceiver } from "@/providers/SseProvider"

export default function StrategiesTab({ initialStrategies }: { initialStrategies: Strategy[] }) {
    const [strategies, setStrategies] = useState(initialStrategies)

    const { notify } = useNotify()

    sseReceiver.on(AppEvents.StrategiesRecalculated, (payload) =>
        setStrategies(
            strategies.map((strategy) => {
                const updated = payload.strategies.find((updated) => strategy.id === updated.id)
                return updated ? { ...strategy, ...updated } : strategy
            })
        )
    )

    const columns: TableProps<Strategy>["columns"] = [
        {
            title: "Название",
            key: "name",
            render: (_, rec) => rec.name,
        },
        {
            title: "Вклад / Доход",
            key: "invested",
            render: (_, rec) => (
                <>
                    <CountUpWithRef end={rec.invested} decimals={2} suffix=" $" />
                    {" / "}
                    <span
                        style={{
                            color: rec.profit > 0 ? "green" : rec.profit < 0 ? "red" : "black",
                        }}
                    >
                        <CountUpWithRef end={rec.profit} decimals={4} suffix=" $" />
                    </span>
                </>
            ),
        },
        {
            title: "PnL",
            key: "fakeProfitMin",
            render: (_, rec) => (
                <>
                    <article style={{ textWrap: "nowrap" }}>
                        {(rec.fakeProfitMin * 100).toFixed(0)}%{" - "}
                    </article>
                    {(rec.fakeProfitMax * 100).toFixed(0)}%
                </>
            ),
        },
        {
            title: "Ожидаемый доход",
            key: "fakeProfitMax",
            width: 175,
            render: (_, rec) =>
                rec.invested > 0 ? (
                    <>
                        <article style={{ textWrap: "nowrap" }}>
                            {(rec.invested * rec.fakeProfitMin).toFixed(2)}${" - "}
                        </article>
                        {(rec.invested * rec.fakeProfitMax).toFixed(2)}$
                    </>
                ) : (
                    "N/A"
                ),
        },
        {
            title: "Статус",
            key: "status",
            width: 1,
            render: (_, rec) => <StrategyStatusTag status={rec.status} />,
        },
        {
            title: "Дата закрытия",
            key: "closesAt",
            width: 150,
            render: (_, rec) => <>{format(rec.closedAt ?? rec.closesAt, "dd-MM-yyyy")}</>,
        },
    ]

    return (
        <Table<Strategy>
            columns={columns}
            pagination={false}
            rowKey={(row) => row.id}
            dataSource={strategies}
            style={{ height: "100%" }}
            scroll={{ x: "min-content" }}
        />
    )
}
