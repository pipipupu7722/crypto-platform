"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/providers/prisma";
import fs from "node:fs";
import path from "node:path";

export const GET = async (
	req: Request,
	context: { params: { id: string } },
) => {
	try {
		const { id } = await context.params;

		const document = await prisma.document.findUnique({
			where: { id },
		});

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
		return new Response(fileStream, {
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
