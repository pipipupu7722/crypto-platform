"use server";

import { UserRole } from "@prisma/client";

import { ProtectSa, wrapsa } from "@/lib/server/helpers";
import { depositWalletsService } from "@/lib/server/services/depositWallets.service";
import {
	DepositWalletSchema,
	type DepositWalletSchemaType,
} from "@/schemas/dashboard/depositWallets.schemas";

export const createDepositWallet = wrapsa(
	async (userId: string, payload: DepositWalletSchemaType) => {
		await ProtectSa([UserRole.ADMIN]);

		return await depositWalletsService.create(
			userId,
			DepositWalletSchema.parse(payload),
		);
	},
);

export const updateDepositWallet = wrapsa(
	async (id: string, payload: DepositWalletSchemaType) => {
		await ProtectSa([UserRole.ADMIN]);

		return await depositWalletsService.update(
			id,
			DepositWalletSchema.parse(payload),
		);
	},
);
