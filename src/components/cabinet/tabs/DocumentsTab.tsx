"use client";

import { User } from "@prisma/client";
import { Button, Descriptions, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

const DocumentsTab = ({ initialUser }: { initialUser: User }) => {
	const [isActionPending, setIsActionPending] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState([]);

	const handleUpload = async (file: File) => {
		try {
			// Симуляция загрузки файла
			await new Promise((resolve) => setTimeout(resolve, 1000));
			message.success(`${file.name} успешно загружен`);
			setUploadedFiles((prev) => [...prev, file]);
			return true;
		} catch (error) {
			message.error(`${file.name} не удалось загрузить`);
			return false;
		}
	};

	const draggerProps = {
		name: "file",
		multiple: true,
		beforeUpload: async (file: File) => {
			const success = await handleUpload(file);
			return false; // Prevent automatic upload by Ant Design
		},
		onChange(info: any) {
			const { status, name } = info.file;
			if (status === "done") {
				message.success(`${name} файл загружен`);
			} else if (status === "error") {
				message.error(`${name} ошибка загрузки`);
			}
		},
	};

	return (
		<div>
			<Descriptions bordered column={1} size="small">
				<Descriptions.Item label="Загруженные документы">
					{uploadedFiles.length > 0 ? (
						<ul>
							{uploadedFiles.map((file: File, index: number) => (
								<li key={index}>{file.name}</li>
							))}
						</ul>
					) : (
						"Нет загруженных документов"
					)}
				</Descriptions.Item>
			</Descriptions>

			<div style={{ marginTop: 20 }}>
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
			</div>

			<div style={{ textAlign: "right", marginTop: 10 }}>
				<Button
					type="primary"
					loading={isActionPending}
					onClick={() => message.success("Документы успешно сохранены")}
				>
					Сохранить документы
				</Button>
			</div>
		</div>
	);
};

export default DocumentsTab;
