"use server"

import { NextResponse } from "next/server"

import { logger } from "@/lib/server/providers/logger"
import { transactionService } from "@/lib/server/services/transactions.service"

export const GET = async (req: Request, { params }: { params: Promise<{ userId: string }> }) => {
    try {
        const { userId } = await params
        return NextResponse.json(await transactionService.getUserTransactions(userId))
    } catch (error) {
        logger.error(error, "Error retrieving transactions")
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
