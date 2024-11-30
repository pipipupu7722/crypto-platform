"use client"

import { Cryptocurrency } from "@prisma/client"
import { Alert, Button, Card, Form, Input, InputNumber, Select } from "antd"
import { useState } from "react"

import { createWithdrawalRequest } from "@/actions/cabinet/withdrawal"
import { useSession } from "@/providers/SessionProvider"
import { WithdrawalTransactionSchemaRule, WithdrawalTransactionSchemaType } from "@/schemas/cabinet/transaction.schema"

export default function WithdrawalCard({ cryptos }: { cryptos: Cryptocurrency[] }) {
    const [loading, setLoading] = useState(false)
    const [symbol, setSymbol] = useState<null | string>(null)
    const [error, setError] = useState<null | string>(null)
    const [form] = Form.useForm()

    const { session } = useSession()

    const handle = async (values: WithdrawalTransactionSchemaType) => {
        setError(null)
        setLoading(true)
        const res = await createWithdrawalRequest(session.User.id, values)
        if (res.success) {
            window.location.search = "?tab=withdrawal"
        } else {
            setLoading(false)
            setError(res.error)
        }
    }

    return (
        <Card title="Вывод средств" bordered={true} style={{ minWidth: 350 }}>
            <Form form={form} layout="horizontal" onFinish={(values) => handle(values)}>
                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: "1rem" }} />}

                <Form.Item<WithdrawalTransactionSchemaType> name="crypto" rules={[WithdrawalTransactionSchemaRule]}>
                    <Select placeholder="Выберите актив" onChange={(value) => setSymbol(value)}>
                        {cryptos.map((crypto) => (
                            <Select.Option value={crypto.symbol}>{crypto.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item<WithdrawalTransactionSchemaType> name="wallet" rules={[WithdrawalTransactionSchemaRule]}>
                    <Input disabled={!symbol} placeholder="Адрес вашего кошелька" />
                </Form.Item>

                <Form.Item<WithdrawalTransactionSchemaType>
                    name="amountUsd"
                    rules={[
                        WithdrawalTransactionSchemaRule,
                        () => ({
                            validator(_, value) {
                                const selectedCrypto = cryptos.find((crypto) => crypto.symbol === symbol)
                                if (!selectedCrypto) {
                                    return Promise.resolve()
                                }
                                const min = selectedCrypto.withdrawalMinUsd
                                const max = selectedCrypto.withdrawalMaxUsd

                                if (!value || (value >= min && value <= max)) {
                                    return Promise.resolve()
                                }
                                return Promise.reject(
                                    new Error(`Введите сумму от ${min.toFixed(2)} $ до ${max.toFixed(2)} $`)
                                )
                            },
                        }),
                    ]}
                >
                    <InputNumber disabled={!symbol} placeholder="Сумма вывода в USD" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                    <Button
                        style={{ width: "100%" }}
                        disabled={!symbol}
                        loading={loading}
                        type="primary"
                        htmlType="submit"
                    >
                        Запросить вывод средств
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}
