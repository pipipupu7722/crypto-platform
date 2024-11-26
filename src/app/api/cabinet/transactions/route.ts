"use server"

import { NextResponse } from "next/server"

import { logger } from "@/lib/server/providers/logger"
import { transactionService } from "@/lib/server/services/transactions.service"
import { getSessionPayload } from "@/lib/server/session"

export const GET = async () => {
    try {
        const session = await getSessionPayload()
        return NextResponse.json(await transactionService.getUserTransactions(session.uid))
    } catch (error) {
        logger.error(error, "Error retrieving transactions")
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
