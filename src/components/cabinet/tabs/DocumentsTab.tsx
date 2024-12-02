"use client";

import type { User } from "@prisma/client";
import { Button, Descriptions, Upload, message, List, Tag, Spin } from "antd";
import {
	UploadOutlined,
	DownloadOutlined,
	CheckCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";

const DocumentsTab = ({ initialUser }: { initialUser: User }) => {
	const [isActionPending, setIsActionPending] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<
		{ id: string; name: string; path: string; status: string }[]
	>([]);
	const [isSaved, setIsSaved] = useState(false);

	useEffect(() => {
		const fetchUploadedFiles = async () => {
			try {
				const response = await fetch(
					`/api/cabinet/documents?userId=${initialUser.id}`,
				);
				if (!response.ok) {
					throw new Error("Не удалось загрузить список документов");
				}
				const result = await response.json();
				setUploadedFiles(
					result.documents.map((doc: { id: string; path: string }) => ({
						id: doc.id,
						name: doc.path.split("/").pop() || "Документ",
						path: doc.path,
						status: "success",
					})),
				);
			} catch (error) {
				console.error(error);
				message.error("Ошибка загрузки списка документов");
			}
		};

		fetchUploadedFiles();
	}, [initialUser.id]);

	const handleUpload = async (file: File) => {
		setIsActionPending(true);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("userId", initialUser.id);

		try {
			console.log("Uploading file:", file.name);

			const response = await fetch("/api/cabinet/documents", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error("Server response error:", errorText);
				throw new Error("Ошибка загрузки файла");
			}

			const result = await response.json();

			if (result.success) {
				setUploadedFiles((prev) => [
					...prev,
					{
						id: result.document.id,
						name: result.document.path.split("/").pop() || file.name,
						path: result.document.path,
						status: "success",
					},
				]);
				message.success(`${file.name} успешно загружен`);
			} else {
				message.error(`${file.name} не удалось загрузить`);
			}
		} catch (error) {
			console.error("Upload error:", error);
			message.error(`${file.name} не удалось загрузить`);
		} finally {
			setIsActionPending(false);
		}
	};

	const draggerProps = {
		name: "file",
		multiple: true,
		beforeUpload: async (file: File) => {
			await handleUpload(file);
			return false;
		},
	};

	const handleSave = () => {
		setIsSaved(true);
		message.success("Документы успешно сохранены!");
	};

	return (
		<div>
			<Descriptions bordered column={1} size="small">
				<Descriptions.Item label="Загруженные документы">
					{uploadedFiles.length > 0 ? (
						<List
							dataSource={uploadedFiles}
							renderItem={(item) => (
								<List.Item
									actions={[
										<Button
											type="link"
											href={`/api/cabinet/documents/${item.id}`}
											icon={<DownloadOutlined />}
										>
											Скачать
										</Button>,
									]}
								>
									<div style={{ display: "flex", alignItems: "center" }}>
										<span>{item.name}</span>
										<Tag color="green" style={{ marginLeft: 8 }}>
											Успешно
										</Tag>
									</div>
								</List.Item>
							)}
						/>
					) : (
						"Нет загруженных документов"
					)}
				</Descriptions.Item>
			</Descriptions>

			<div style={{ marginTop: 20 }}>
				<Spin spinning={isActionPending}>
					<Upload.Dragger {...draggerProps} style={{ padding: 20 }}>
						<p className="ant-upload-drag-icon">
							<UploadOutlined />
						</p>
						<p className="ant-upload-text">
							Перетащите файл сюда или нажмите, чтобы выбрать
						</p>
						<p className="ant-upload-hint">
							Поддерживаются одиночные или множественные загрузки. Формат: jpg,
							png, pdf.
						</p>
					</Upload.Dragger>
				</Spin>
			</div>

			<div style={{ textAlign: "center", marginTop: 10 }}>
				<Button
					type="primary"
					loading={isActionPending}
					onClick={handleSave}
					disabled={isActionPending}
				>
					Сохранить документы
				</Button>
			</div>

			{isSaved && (
				<div style={{ textAlign: "center", marginTop: 20 }}>
					<CheckCircleOutlined style={{ fontSize: 24, color: "green" }} />
					<p>Документы успешно сохранены!</p>
				</div>
			)}
		</div>
	);
};

export default DocumentsTab;
