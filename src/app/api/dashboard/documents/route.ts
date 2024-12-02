"use server";

import { NextResponse } from "next/server";
import { documentsService } from "@/lib/server/services/documents.service";
import fs from "node:fs";
import path from "node:path";

export const GET = async (req: Request) => {
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return NextResponse.json(
				{ success: false, message: "Не указан идентификатор пользователя" },
				{ status: 400 },
			);
		}

		const documents = await documentsService.getDocumentsByUserId(userId);

		return NextResponse.json({ success: true, documents });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, message: "Ошибка загрузки документов" },
			{ status: 500 },
		);
	}
};
