"use server";

import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const POST = async (req: Request) => {
	try {
		const formData = await req.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			return NextResponse.json(
				{ success: false, message: "Файл не предоставлен" },
				{ status: 400 },
			);
		}

		const buffer = Buffer.from(await file.arrayBuffer());

		const uploadsDir = path.join(process.cwd(), "uploads");
		if (!fs.existsSync(uploadsDir)) {
			fs.mkdirSync(uploadsDir);
		}

		const filePath = path.join(uploadsDir, `${Date.now()}-${file.name}`);
		fs.writeFileSync(filePath, buffer);

		return NextResponse.json({ success: true, filePath });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, message: "Ошибка загрузки файла" },
			{ status: 500 },
		);
	}
};
