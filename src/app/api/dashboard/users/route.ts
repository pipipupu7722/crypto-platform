"use server"

import { NextResponse } from "next/server"
import { ZodError } from "zod"

import { logger } from "@/lib/server/providers/logger"
import { usersService } from "@/lib/server/services/users.service"
import { GetUsersSchema } from "@/schemas/dashboard/user.schemas"

export const GET = async (req: Request) => {
    try {
        const params = new URL(req.url).searchParams
        const query = GetUsersSchema.parse({
            page: params.get("page") ? parseInt(params.get("page") as string) : undefined,
            pageSize: params.get("pageSize") ? parseInt(params.get("pageSize") as string) : undefined,
            sortBy: params.get("sortBy") ?? undefined,
            sortOrder: params.get("sortOrder") ?? undefined,
            searchQuery: params.get("searchQuery") ?? undefined,
        })
        const result = await usersService.getUsers(query)

        return NextResponse.json(result)
    } catch (error) {
        logger.error(error, "Error retrieving users")
        if (error instanceof ZodError) {
            return NextResponse.json({ success: false }, { status: 400 })
        }
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
