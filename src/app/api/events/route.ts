import { NextRequest } from "next/server"

import { sseEmitter } from "@/lib/server/providers/sse.emitter"

export const GET = async (request: NextRequest) => sseEmitter.connect(request)
