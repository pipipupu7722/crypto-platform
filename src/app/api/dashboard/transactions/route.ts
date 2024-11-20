"use server"

import { NextResponse } from "next/server"

import { logger } from "@/lib/server/logger"
import { prisma } from "@/lib/server/prisma"
import { getSessionPayload } from "@/lib/server/session"

export const GET = async () => {
    try {
        const session = await getSessionPayload()
        return NextResponse.json(
            await prisma.transaction.findMany({ where: { userId: session.uid }, orderBy: { createdAt: "desc" } })
        )
    } catch (error) {
        logger.error("Error: " + (error as Error).message)
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
