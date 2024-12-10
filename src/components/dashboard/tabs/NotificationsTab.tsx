"use client";

import { Button, Form, Input } from "antd";
import { useState } from "react";

import { useNotify } from "@/providers/NotifyProvider";

const NotificationTab = ({ userId }: { userId: string }) => {
	const [form] = Form.useForm();
	const [isSending, setIsSending] = useState(false);
	const { notify } = useNotify();

	const handleSendNotification = async (values: {
		title: string;
		description: string;
	}) => {
		setIsSending(true);
		try {
			const response = await fetch(
				`/api/dashboard/users/${userId}/notifications`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						title: values.title,
						description: values.description,
					}),
				},
			);

			const result = await response.json();

			if (!response.ok || !result.success) {
				throw new Error(result.message || "Ошибка отправки уведомления");
			}

			notify.success({ message: "Уведомление успешно отправлено!" });
			form.resetFields();
		} catch (error) {
			console.error(error);
			notify.error({
				message: "Ошибка отправки уведомления",
				description: "Что-то пошло не так",
			});
		} finally {
			setIsSending(false);
		}
	};

	return (
		<div>
			<Form form={form} layout="vertical" onFinish={handleSendNotification}>
				<Form.Item
					label="Заголовок"
					name="title"
					rules={[{ required: true, message: "Пожалуйста, введите заголовок" }]}
				>
					<Input placeholder="Введите заголовок уведомления" />
				</Form.Item>

				<Form.Item
					label="Описание"
					name="description"
					rules={[{ required: true, message: "Пожалуйста, введите описание" }]}
				>
					<Input.TextArea rows={4} placeholder="Введите текст уведомления" />
				</Form.Item>

				<div style={{ textAlign: "right" }}>
					<Button type="primary" htmlType="submit" loading={isSending}>
						Отправить уведомление
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default NotificationTab;
