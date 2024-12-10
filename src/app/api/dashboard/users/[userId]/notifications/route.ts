import { NextResponse } from "next/server";
import { notificationsService } from "@/lib/server/services/notifications.service";

export const POST = async (
	req: Request,
	{ params }: { params: Promise<{ userId: string }> },
) => {
	try {
		const { title, description } = await req.json();
		const { userId } = await params;

		if (!title || !description || !userId) {
			return NextResponse.json(
				{ success: false, message: "Отсутствуют обязательные параметры" },
				{ status: 400 },
			);
		}

		await notificationsService.sendCustomNotification(
			userId,
			title,
			description,
		);

		return NextResponse.json({
			success: true,
			message: "Уведомление отправлено",
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, message: "Ошибка сервера при отправке уведомления" },
			{ status: 500 },
		);
	}
};
