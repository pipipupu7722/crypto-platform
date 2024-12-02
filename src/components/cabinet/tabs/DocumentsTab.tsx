"use client";

import type { User } from "@prisma/client";
import { Button, Descriptions, Upload, message, List, Tag, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

const DocumentsTab = ({ initialUser }: { initialUser: User }) => {
	const [isActionPending, setIsActionPending] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<
		{ name: string; status: string }[]
	>([]);

	const handleUpload = async (file: File) => {
		setIsActionPending(true);
		const formData = new FormData();
		formData.append("file", file);

		setUploadedFiles((prev) => [
			...prev,
			{ name: file.name, status: "loading" },
		]);

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
				setUploadedFiles((prev) =>
					prev.map((item) =>
						item.name === file.name ? { ...item, status: "success" } : item,
					),
				);
				message.success(`${file.name} успешно загружен`);
			} else {
				setUploadedFiles((prev) =>
					prev.map((item) =>
						item.name === file.name ? { ...item, status: "error" } : item,
					),
				);
				message.error(`${file.name} не удалось загрузить`);
			}
		} catch (error) {
			console.error("Upload error:", error);
			setUploadedFiles((prev) =>
				prev.map((item) =>
					item.name === file.name ? { ...item, status: "error" } : item,
				),
			);
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

	return (
		<div>
			<Descriptions bordered column={1} size="small">
				<Descriptions.Item label="Загруженные документы">
					{uploadedFiles.length > 0 ? (
						<List
							dataSource={uploadedFiles}
							renderItem={(item) => (
								<List.Item>
									{item.name}{" "}
									<Tag
										color={item.status === "success" ? "green" : "red"}
										style={{ marginLeft: 8 }}
									>
										{item.status === "success" ? "Успешно" : "Ошибка"}
									</Tag>
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

			<div style={{ textAlign: "right", marginTop: 10 }}>
				<Button
					type="primary"
					loading={isActionPending}
					onClick={() => message.success("Документы успешно сохранены")}
					disabled={isActionPending}
				>
					Сохранить документы
				</Button>
			</div>
		</div>
	);
};

export default DocumentsTab;
