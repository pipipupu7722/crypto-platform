"use client";

import type { User } from "@prisma/client";
import {
	Button,
	Descriptions,
	Upload,
	message,
	List,
	Tag,
	Spin,
	Row,
	Col,
	Form,
	Input,
	Select,
	DatePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { updateUserDetails } from "@/actions/cabinet/user";

const { Option } = Select;

const DocumentsTab = ({ initialUser }: { initialUser: User }) => {
	const [isActionPending, setIsActionPending] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<
		{ id: string; name: string; path: string; status: string }[]
	>([]);
	const [uploadedSelfies, setUploadedSelfies] = useState<
		{ id: string; name: string; path: string; status: string }[]
	>([]);
	const [pendingDocuments, setPendingDocuments] = useState<File[]>([]);
	const [pendingSelfie, setPendingSelfie] = useState<File | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		const fetchUploadedData = async () => {
			try {
				const response = await fetch(
					`/api/cabinet/documents?userId=${initialUser.id}`,
				);
				if (!response.ok) {
					throw new Error("Не удалось загрузить список документов");
				}
				const result = await response.json();

				const documents = result.documents.filter(
					(doc: { type: string }) => doc.type === "ID",
				);
				const selfies = result.documents.filter(
					(doc: { type: string }) => doc.type === "SELFIE",
				);

				setUploadedFiles(
					documents.map((doc: { id: string; path: string }) => ({
						id: doc.id,
						name: doc.path.split("/").pop() || "Документ",
						path: doc.path,
						status: "success",
					})),
				);

				setUploadedSelfies(
					selfies.map((selfie: { id: string; path: string }) => ({
						id: selfie.id,
						name: selfie.path.split("/").pop() || "Селфи",
						path: selfie.path,
						status: "success",
					})),
				);
			} catch (error) {
				console.error(error);
				message.error("Ошибка загрузки данных");
			}
		};

		fetchUploadedData();
	}, [initialUser.id]);

	const handleSave = async () => {
		const values = await form.validateFields();
		setIsActionPending(true);

		console.log("values", values);

		// Сохраняем данные пользователя
		await updateUserDetails(initialUser.id, {
			...initialUser,
			idType: values.idType,
			idNumber: values.idNumber,
			dob: values.dob ? values.dob.toISOString() : null,
			country: values.country,
		})
			.then(
				(res) =>
					res.success ??
					message.success("Данные пользователя успешно обновлены!"),
			)
			.finally(() => setIsActionPending(false));

		if (pendingDocuments.length === 0 && !pendingSelfie) {
			message.warning("Нет новых файлов для загрузки");
			return;
		}

		setIsActionPending(true);

		try {
			for (const file of pendingDocuments) {
				await uploadFile(file, "ID");
			}

			if (pendingSelfie) {
				await uploadFile(pendingSelfie, "SELFIE");
			}

			message.success("Файлы успешно загружены!");
			setPendingDocuments([]);
			setPendingSelfie(null);
		} catch (error) {
			console.error(error);
			message.error("Ошибка загрузки файлов");
		} finally {
			setIsActionPending(false);
		}
	};

	const uploadFile = async (file: File, type: "ID" | "SELFIE") => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("userId", initialUser.id);
		formData.append("type", type);

		const response = await fetch("/api/cabinet/documents", {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Server response error:", errorText);
			throw new Error(`Ошибка загрузки файла ${file.name}`);
		}

		const result = await response.json();

		if (result.success) {
			if (type === "ID") {
				setUploadedFiles((prev) => [
					...prev,
					{
						id: result.document.id,
						name: result.document.path.split("/").pop() || file.name,
						path: result.document.path,
						status: "success",
					},
				]);
			} else {
				setUploadedSelfies((prev) => [
					...prev,
					{
						id: result.document.id,
						name: result.document.path.split("/").pop() || file.name,
						path: result.document.path,
						status: "success",
					},
				]);
			}
		} else {
			throw new Error(`Ошибка загрузки файла ${file.name}`);
		}
	};

	const draggerProps = (type: "ID" | "SELFIE") => ({
		name: "file",
		multiple: type === "ID",
		beforeUpload: (file: File) => {
			if (type === "ID") {
				setPendingDocuments((prev) => [...prev, file]);
			} else {
				setPendingSelfie(file);
			}
			message.success(`Файл ${file.name} добавлен в очередь`);
			return false;
		},
	});

	return (
		<div>
			<Form
				form={form}
				layout="vertical"
				initialValues={{
					idType: initialUser.idType || undefined,
					idNumber: initialUser.idNumber || undefined,
					dob: initialUser.dob || undefined,
					country: initialUser.country || undefined,
				}}
			>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item label="Тип документа" name="idType">
							<Select placeholder="Выберите тип документа">
								<Option value="passport">Паспорт</Option>
								<Option value="id_card">ID карта</Option>
							</Select>
						</Form.Item>

						<Form.Item label="Номер документа" name="idNumber">
							<Input placeholder="Введите номер документа" />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label="Дата рождения" name="dob">
							<DatePicker
								style={{ width: "100%" }}
								placeholder="Выберите дату"
							/>
						</Form.Item>

						<Form.Item label="Страна" name="country">
							<Select placeholder="Выберите страну">
								<Option value="russia">Россия</Option>
								<Option value="usa">США</Option>
								<Option value="china">Китай</Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Descriptions
							bordered
							column={1}
							size="small"
							style={{ marginBottom: 16 }}
						>
							<Descriptions.Item label="Загруженные документы">
								<List
									dataSource={[
										...uploadedFiles,
										...pendingDocuments.map((file) => ({
											id: `pending-${file.name}`,
											name: file.name,
											status: "pending",
										})),
									]}
									renderItem={(item) => (
										<List.Item>
											<div style={{ display: "flex", alignItems: "center" }}>
												<span>{item.name}</span>
												<Tag
													color={item.status === "success" ? "green" : "orange"}
													style={{ marginLeft: 8 }}
												>
													{item.status === "success" ? "Успешно" : "В очереди"}
												</Tag>
											</div>
										</List.Item>
									)}
								/>
							</Descriptions.Item>
						</Descriptions>

						<Spin spinning={isActionPending}>
							<Upload.Dragger {...draggerProps("ID")} style={{ height: 150 }}>
								<p className="ant-upload-drag-icon">
									<UploadOutlined />
								</p>
								<p className="ant-upload-text">
									Перетащите документы сюда или нажмите
								</p>
								<p className="ant-upload-hint">
									Загрузите документы. Формат: jpg, png, pdf.
								</p>
							</Upload.Dragger>
						</Spin>
					</Col>

					<Col span={12}>
						<Descriptions
							bordered
							column={1}
							size="small"
							style={{ marginBottom: 16 }}
						>
							<Descriptions.Item label="Загруженные селфи">
								<List
									dataSource={[
										...uploadedSelfies,
										...(pendingSelfie
											? [
													{
														id: `pending-${pendingSelfie.name}`,
														name: pendingSelfie.name,
														status: "pending",
													},
												]
											: []),
									]}
									renderItem={(item) => (
										<List.Item>
											<div style={{ display: "flex", alignItems: "center" }}>
												<span>{item.name}</span>
												<Tag
													color={item.status === "success" ? "green" : "orange"}
													style={{ marginLeft: 8 }}
												>
													{item.status === "success" ? "Успешно" : "В очереди"}
												</Tag>
											</div>
										</List.Item>
									)}
								/>
							</Descriptions.Item>
						</Descriptions>

						<Spin spinning={isActionPending}>
							<Upload.Dragger
								{...draggerProps("SELFIE")}
								style={{ height: 150 }}
							>
								<p className="ant-upload-drag-icon">
									<UploadOutlined />
								</p>
								<p className="ant-upload-text">
									Перетащите селфи сюда или нажмите
								</p>
								<p className="ant-upload-hint">
									Загрузите селфи. Формат: jpg, png.
								</p>
							</Upload.Dragger>
						</Spin>
					</Col>
				</Row>
			</Form>

			<div style={{ textAlign: "center", marginTop: 20 }}>
				<Button
					type="primary"
					loading={isActionPending}
					onClick={handleSave}
					disabled={isActionPending}
				>
					Сохранить файлы
				</Button>
			</div>
		</div>
	);
};

export default DocumentsTab;
