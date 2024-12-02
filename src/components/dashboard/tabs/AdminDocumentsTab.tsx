"use client";

import type { User } from "@prisma/client";
import { Button, Descriptions, List, Tag, message } from "antd";
import { DownloadOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const AdminDocumentsTab = ({ targetUser }: { targetUser: User }) => {
	const [uploadedFiles, setUploadedFiles] = useState<
		{ id: string; name: string; path: string; status: string }[]
	>([]);
	const [isLoaded, setIsLoaded] = useState(false); // Флаг для статуса загрузки документов

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
					result.documents.map((doc: { id: string; path: string }) => ({
						id: doc.id,
						name: doc.path.split("/").pop() || "Документ",
						path: doc.path,
						status: "success",
					})),
				);
				setIsLoaded(true);
			} catch (error) {
				console.error(error);
				message.error("Ошибка загрузки списка документов");
			}
		};

		fetchUploadedFiles();
	}, [targetUser.id]);

	return (
		<div>
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
					) : isLoaded ? (
						"Нет загруженных документов"
					) : (
						"Загрузка документов..."
					)}
				</Descriptions.Item>
			</Descriptions>

			{isLoaded && uploadedFiles.length === 0 && (
				<div style={{ textAlign: "center", marginTop: 20 }}>
					<CheckCircleOutlined style={{ fontSize: 24, color: "red" }} />
					<p>У пользователя нет загруженных документов.</p>
				</div>
			)}
		</div>
	);
};

export default AdminDocumentsTab;
