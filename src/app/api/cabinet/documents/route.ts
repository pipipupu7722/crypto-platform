"use server";

import { NextResponse } from "next/server";
import { documentsService } from "@/lib/server/services/documents.service";
import fs from "node:fs";
import path from "node:path";
import { DocumentType } from "@prisma/client";

export const GET = async (req: Request) => {
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");
		const type = searchParams.get("type") as DocumentType | null;

		if (!userId) {
			return NextResponse.json(
				{ success: false, message: "Не указан идентификатор пользователя" },
				{ status: 400 },
			);
		}

		const documents = type
			? await documentsService.getDocumentsByType(userId, type)
			: await documentsService.getDocumentsByUserId(userId);

		return NextResponse.json({ success: true, documents });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, message: "Ошибка загрузки документов" },
			{ status: 500 },
		);
	}
};

export const POST = async (req: Request) => {
	try {
		const formData = await req.formData();
		const file = formData.get("file") as File | null;
		const userId = formData.get("userId") as string;
		const type = formData.get("type") as DocumentType | null;

		console.log("formData", formData);

		if (!file) {
			return NextResponse.json(
				{ success: false, message: "Файл не предоставлен" },
				{ status: 400 },
			);
		}

		if (!userId) {
			return NextResponse.json(
				{ success: false, message: "Не указан идентификатор пользователя" },
				{ status: 400 },
			);
		}

		if (!type || !Object.values(DocumentType).includes(type)) {
			return NextResponse.json(
				{ success: false, message: "Некорректный тип документа" },
				{ status: 400 },
			);
		}

		const buffer = Buffer.from(await file.arrayBuffer());
		const uploadsDir = path.join(process.cwd(), "uploads/documents", userId);

		if (!fs.existsSync(uploadsDir)) {
			fs.mkdirSync(uploadsDir, { recursive: true });
		}

		const filePath = path.join(uploadsDir, `${Date.now()}-${file.name}`);
		fs.writeFileSync(filePath, buffer);

		const document = await documentsService.createDocument(
			userId,
			filePath,
			type,
		);

		return NextResponse.json({ success: true, document });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, message: "Ошибка загрузки файла" },
			{ status: 500 },
		);
	}
};
