"use client";

import {
	Cryptocurrency,
	DepositWallet,
	Transaction,
	TransactionStatus,
} from "@prisma/client";
import {
	Button,
	Descriptions,
	Form,
	Input,
	InputNumber,
	Modal,
	Select,
} from "antd";
import { useEffect } from "react";

import { TransactionStatusTag, TransactionTypeTag } from "../misc/Tags";
import {
	DepositTransactionSchemaRule,
	DepositTransactionSchemaType,
} from "@/schemas/dashboard/transaction.schemas";

type TransactionModalProps = {
	open: boolean;
	depositWallets: DepositWallet[];
	cryptocurrencies: Cryptocurrency[];
	transaction?: Partial<Transaction>;
	isEditing?: boolean;
	loading?: boolean;
	onClose: () => void;
	onUpdate: (transaction: DepositTransactionSchemaType) => void;
	onCreate: (transaction: DepositTransactionSchemaType) => void;
};

const TransactionModal: React.FC<TransactionModalProps> = ({
	open,
	cryptocurrencies,
	depositWallets,
	transaction = {
		crypto: cryptocurrencies[0]?.symbol ?? undefined,
		amount: 0,
		amountUsd: 0,
		status: TransactionStatus.PENDING,
	},
	isEditing = false,
	loading = false,
	onClose,
	onUpdate,
	onCreate,
}) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (open) {
			form.setFieldsValue(transaction);
		}
	}, [transaction]);

	return (
		<Modal
			open={open}
			title={isEditing ? "Редактировать транзакцию" : "Добавить транзакцию"}
			onCancel={() => {
				form.resetFields();
				onClose();
			}}
			footer={[
				<Button
					key="submit"
					type="primary"
					loading={loading}
					onClick={() => {
						form.validateFields().then((values) => {
							if (isEditing) {
								onUpdate(values);
							} else {
								onCreate(values);
							}
						});
					}}
				>
					{isEditing ? "Принять" : "Создать"}
				</Button>,
				<Button key="cancel" onClick={onClose}>
					Отмена
				</Button>,
			]}
		>
			<Form form={form} layout="horizontal">
				<Descriptions bordered column={1} size="small">
					<Descriptions.Item label="Криптовалюта">
						<Form.Item<DepositTransactionSchemaType>
							name="crypto"
							style={{ marginBottom: 0 }}
							rules={[DepositTransactionSchemaRule]}
						>
							{transaction.wallet ? (
								transaction.crypto
							) : (
								<Select>
									{cryptocurrencies.map((crypto) => (
										<Select.Option value={crypto.symbol}>
											{crypto.name}
										</Select.Option>
									))}
								</Select>
							)}
						</Form.Item>
					</Descriptions.Item>

					{transaction.wallet && (
						<Descriptions.Item label="Адрес кошелька">
							<Form.Item
								name="wallet"
								style={{ marginBottom: 0 }}
								rules={[DepositTransactionSchemaRule]}
							>
								{transaction.wallet}
							</Form.Item>
						</Descriptions.Item>
					)}

					{transaction.wallet && (
						<Descriptions.Item label="Хэш транзакции">
							<Form.Item<DepositTransactionSchemaType>
								name="txHash"
								style={{ marginBottom: 0 }}
								rules={[DepositTransactionSchemaRule]}
							>
								<Input />
							</Form.Item>
						</Descriptions.Item>
					)}

					{!transaction.wallet && (
						<Descriptions.Item label="Банк">
							<Form.Item
								name="bankName"
								style={{ marginBottom: 0 }}
								rules={[DepositTransactionSchemaRule]}
							>
								{transaction.bankName}
							</Form.Item>
						</Descriptions.Item>
					)}

					{!transaction.wallet && (
						<Descriptions.Item label="Номер карты">
							<Form.Item
								name="cardNumber"
								style={{ marginBottom: 0 }}
								rules={[DepositTransactionSchemaRule]}
							>
								{transaction.cardNumber}
							</Form.Item>
						</Descriptions.Item>
					)}

					{!transaction.wallet && (
						<Descriptions.Item label="Действительна до">
							<Form.Item
								name="cardDate"
								style={{ marginBottom: 0 }}
								rules={[DepositTransactionSchemaRule]}
							>
								{transaction.cardDate}
							</Form.Item>
						</Descriptions.Item>
					)}

					<Descriptions.Item label="Сумма">
						<Form.Item<DepositTransactionSchemaType>
							name="amount"
							style={{ marginBottom: 0 }}
							rules={[DepositTransactionSchemaRule]}
						>
							<InputNumber min={0} style={{ width: "100%" }} />
						</Form.Item>
					</Descriptions.Item>

					<Descriptions.Item label="Сумма в USD">
						<Form.Item<DepositTransactionSchemaType>
							name="amountUsd"
							style={{ marginBottom: 0 }}
							rules={[DepositTransactionSchemaRule]}
						>
							<InputNumber min={0} style={{ width: "100%" }} />
						</Form.Item>
					</Descriptions.Item>

					{transaction.type && (
						<Descriptions.Item label="Тип">
							<Form.Item
								name="type"
								style={{ marginBottom: 0 }}
								rules={[DepositTransactionSchemaRule]}
							>
								<TransactionTypeTag type={transaction.type} />
							</Form.Item>
						</Descriptions.Item>
					)}

					<Descriptions.Item label="Статус">
						<Form.Item<DepositTransactionSchemaType>
							name="status"
							style={{ marginBottom: 0 }}
							rules={[DepositTransactionSchemaRule]}
						>
							<Select>
								<Select.Option value={TransactionStatus.PENDING}>
									<TransactionStatusTag
										key={TransactionStatus.PENDING}
										status={TransactionStatus.PENDING}
									/>
								</Select.Option>
								<Select.Option value={TransactionStatus.COMPLETE}>
									<TransactionStatusTag
										key={TransactionStatus.COMPLETE}
										status={TransactionStatus.COMPLETE}
									/>
								</Select.Option>
								<Select.Option value={TransactionStatus.CANCELLED}>
									<TransactionStatusTag
										key={TransactionStatus.CANCELLED}
										status={TransactionStatus.CANCELLED}
									/>
								</Select.Option>
							</Select>
						</Form.Item>
					</Descriptions.Item>

					<Descriptions.Item label="Описание">
						<Form.Item<DepositTransactionSchemaType>
							name="description"
							style={{ marginBottom: 0 }}
							rules={[DepositTransactionSchemaRule]}
						>
							<Input.TextArea />
						</Form.Item>
					</Descriptions.Item>
				</Descriptions>
			</Form>
		</Modal>
	);
};

export default TransactionModal;
