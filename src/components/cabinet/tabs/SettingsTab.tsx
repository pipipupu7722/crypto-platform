"use client";

import { User } from "@prisma/client";
import { Button, Descriptions, Form, Input } from "antd";
import PhoneInput from "antd-phone-input";
import { format } from "date-fns";
import { parsePhoneNumber } from "libphonenumber-js";
import { notFound } from "next/navigation";
import { useState } from "react";

import CountryFlag from "../../misc/CountryFlag";

import {
	UserDetailsSchemaRule,
	type UserDetailsSchemaType,
} from "@/schemas/dashboard/user.schemas";
import { updateUserDetails } from "@/actions/cabinet/user";

const SettingsTab = ({ initialUser }: { initialUser: User }) => {
	const [isActionPending, setIsActionPending] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [user, setUser] = useState(initialUser);
	const [form] = Form.useForm();

	if (!user) {
		return notFound();
	}

	const toggleEditMode = () => {
		if (isEditing) form.resetFields();
		setIsEditing(!isEditing);
	};

	return (
		<div>
			<Form form={form} layout="vertical" initialValues={user}>
				<Descriptions bordered column={1} size="small">
					<Descriptions.Item label="Email">
						<Form.Item<UserDetailsSchemaType>
							style={{ marginBottom: 0 }}
							name="email"
							rules={[UserDetailsSchemaRule]}
						>
							{isEditing ? <Input /> : user.email}
						</Form.Item>
					</Descriptions.Item>

					<Descriptions.Item label="Юзернейм">
						<Form.Item<UserDetailsSchemaType>
							style={{ marginBottom: 0 }}
							name="username"
							rules={[UserDetailsSchemaRule]}
						>
							{isEditing ? <Input /> : user.username}
						</Form.Item>
					</Descriptions.Item>

					<Descriptions.Item label="Имя">
						<Form.Item<UserDetailsSchemaType>
							style={{ marginBottom: 0 }}
							name="firstName"
							rules={[UserDetailsSchemaRule]}
						>
							{isEditing ? <Input /> : (user.firstName ?? "N/A")}
						</Form.Item>
					</Descriptions.Item>

					<Descriptions.Item label="Фамилия">
						<Form.Item<UserDetailsSchemaType>
							style={{ marginBottom: 0 }}
							name="lastName"
							rules={[UserDetailsSchemaRule]}
						>
							{isEditing ? <Input /> : (user.lastName ?? "N/A")}
						</Form.Item>
					</Descriptions.Item>

					<Descriptions.Item label="Номер телефона">
						<Form.Item<UserDetailsSchemaType>
							style={{ marginBottom: 0 }}
							name="phone"
							rules={[
								{
									validator: (_, { valid }) => {
										if (valid(true)) return Promise.resolve();
										return Promise.reject("Invalid phone number");
									},
								},
							]}
						>
							{isEditing ? (
								<PhoneInput />
							) : (
								<>
									{user.country ? (
										<CountryFlag country={user.country} />
									) : (
										"N/A"
									)}
									&nbsp;
									{user.phone
										? parsePhoneNumber(user.phone).formatInternational()
										: "N/A"}
								</>
							)}
						</Form.Item>
					</Descriptions.Item>
				</Descriptions>
			</Form>

			<div style={{ textAlign: "right", marginTop: 10 }}>
				{isEditing ? (
					<>
						<Button
							type="primary"
							loading={isActionPending}
							style={{ marginRight: 8 }}
							onClick={() =>
								form
									.validateFields()
									.then((details) => updateUserDetails(user.id, details))
							}
						>
							Применить
						</Button>
						<Button onClick={toggleEditMode}>Отмена</Button>
					</>
				) : (
					<>
						<Button type="default" onClick={toggleEditMode}>
							Редактировать
						</Button>
					</>
				)}
			</div>
		</div>
	);
};

export default SettingsTab;
