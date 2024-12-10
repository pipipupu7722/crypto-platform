import { createSchemaFieldRule } from "antd-zod";
import { z } from "zod";

//
export const WithdrawalTransactionSchema = z.object({
	crypto: z.string({ message: "Выберите криптовалюту" }),
	wallet: z.string({ message: "Введите адрес своего кошелька" }).optional(),
	bankName: z.string({ message: "Введите имя банка" }).optional(),
	cardNumber: z
		.string({ message: "Введите номер карты" })
		.refine((value) => /^[0-9]{16}$/.test(value), {
			message: "Номер карты должен состоять из 16 цифр",
		})
		.optional(),
	cardDate: z
		.string({ message: "Введите дату карты" })
		.refine(
			(value) => {
				const regex = /^(0[1-9]|1[0-2])\/\d{4}$/; // MM/YYYY format
				if (!regex.test(value)) {
					return false;
				}
				const [month, year] = value.split("/").map(Number);
				const now = new Date();
				const currentMonth = now.getMonth() + 1; // Months are 0-indexed
				const currentYear = now.getFullYear();

				// Check if the date is not in the past
				return (
					year > currentYear || (year === currentYear && month >= currentMonth)
				);
			},
			{
				message: "Дата карты должна быть в формате MM/YYYY и не быть в прошлом",
			},
		)
		.optional(),
	amountUsd: z.number({ message: "Введите сумму в долларах" }),
});
export const WithdrawalTransactionSchemaRule = createSchemaFieldRule(
	WithdrawalTransactionSchema,
);
export type WithdrawalTransactionSchemaType = z.infer<
	typeof WithdrawalTransactionSchema
>;
