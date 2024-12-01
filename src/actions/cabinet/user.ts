"use server";

import { wrapsa } from "@/lib/server/helpers";
import { usersService } from "@/lib/server/services/users.service";
import { ProfileSetupSchema } from "@/schemas/auth.schemas";
import { UserDetailsSchemaType } from "@/schemas/dashboard/user.schemas";

export const updateUserDetails = wrapsa(
	async (userId: string, userDetails: UserDetailsSchemaType) => {
		const details = ProfileSetupSchema.parse(userDetails);
		const phone =
			"+" +
			details.phone.countryCode +
			details.phone.areaCode +
			details.phone.phoneNumber;
		return usersService.update(userId, { ...details, phone });
	},
);
