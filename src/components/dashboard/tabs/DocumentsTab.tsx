"use client";

import type { User } from "@prisma/client";
import { Button, Descriptions, List, Tag, message, Popconfirm } from "antd";
import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const DocumentsTab = ({ targetUser }: { targetUser: User }) => {
	const [uploadedFiles, setUploadedFiles] = useState<
		{ id: string; name: string; path: string; status: string; type: string }[]
	>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const fetchUploadedFiles = async () => {
			try {
				const response = await fetch(
					`/api/dashboard/documents?userId=${targetUser.id}`,
				);
				if (!response.ok) {
					throw new Error("Не удалось загрузить список документов");
				}
				const result = await response.json();
				setUploadedFiles(
					result.documents.map(
						(doc: { id: string; path: string; type: string }) => ({
							id: doc.id,
							name: doc.path.split("/").pop() || "Документ",
							path: doc.path,
							type: doc.type,
							status: "success",
						}),
					),
				);
				setIsLoaded(true);
			} catch (error) {
				console.error(error);
				message.error("Ошибка загрузки списка документов");
			}
		};

		fetchUploadedFiles();
	}, [targetUser.id]);

	const handleDelete = async (documentId: string) => {
		try {
			const response = await fetch(`/api/dashboard/documents/${documentId}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				throw new Error("Не удалось удалить документ");
			}

			message.success("Документ успешно удален");
			setUploadedFiles((prev) => prev.filter((file) => file.id !== documentId));
		} catch (error) {
			console.error(error);
			message.error("Ошибка удаления документа");
		}
	};

	return (
		<div>
			<Descriptions
				bordered
				column={1}
				size="small"
				style={{ marginBottom: 20 }}
			>
				<Descriptions.Item label="Тип документа">
					{targetUser.idType || "N/A"}
				</Descriptions.Item>
				<Descriptions.Item label="Номер документа">
					{targetUser.idNumber || "N/A"}
				</Descriptions.Item>
				<Descriptions.Item label="Дата рождения">
					{targetUser.dob
						? new Date(targetUser.dob).toLocaleDateString()
						: "N/A"}
				</Descriptions.Item>
				<Descriptions.Item label="Страна">
					{targetUser.country || "N/A"}
				</Descriptions.Item>
			</Descriptions>

			<Descriptions bordered column={1} size="small">
				<Descriptions.Item
					label={`Документы пользователя ${targetUser.username}`}
				>
					{uploadedFiles.length > 0 ? (
						<List
							dataSource={uploadedFiles}
							renderItem={(item) => (
								<List.Item
									actions={[
										<Button
											type="link"
											href={`/api/dashboard/documents/${item.id}`}
											icon={<DownloadOutlined />}
										>
											Скачать
										</Button>,
										<Popconfirm
											title="Вы уверены, что хотите удалить этот документ?"
											onConfirm={() => handleDelete(item.id)}
											okText="Да"
											cancelText="Нет"
										>
											<Button type="link" danger icon={<DeleteOutlined />}>
												Удалить
											</Button>
										</Popconfirm>,
									]}
								>
									<div style={{ display: "flex", alignItems: "center" }}>
										<span>{item.name}</span>
										<Tag color="green" style={{ marginLeft: 8 }}>
											{item.type}
										</Tag>
									</div>
								</List.Item>
							)}
						/>
					) : (
						<p>У пользователя нет загруженных документов.</p>
					)}
				</Descriptions.Item>
			</Descriptions>
		</div>
	);
};

export default DocumentsTab;
