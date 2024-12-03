"use server";

import { NextResponse } from "next/server";
import { documentsService } from "@/lib/server/services/documents.service";
import fs from "node:fs";
import path from "node:path";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const GET = async (req: Request, context: { params: any }) => {
	try {
		const { id } = await context.params;

		const document = await documentsService.getDocumentById(id);

		if (!document) {
			return NextResponse.json(
				{ success: false, message: "Документ не найден" },
				{ status: 404 },
			);
		}

		const filePath = document.path;

		if (!fs.existsSync(filePath)) {
			return NextResponse.json(
				{ success: false, message: "Файл не найден на сервере" },
				{ status: 404 },
			);
		}

		const fileStream = fs.createReadStream(filePath);
		const fileName = path.basename(document.path);
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		return new Response(fileStream as any, {
			headers: {
				"Content-Disposition": `attachment; filename="${fileName}"`,
				"Content-Type": "application/octet-stream",
			},
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, message: "Ошибка сервера" },
			{ status: 500 },
		);
	}
};
