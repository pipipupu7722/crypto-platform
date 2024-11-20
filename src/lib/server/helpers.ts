import { NextResponse } from "next/server"
import "server-only"

import { appconf } from "@/appconf"

export const isProtectedUrl = (urlPath: string) => {
    for (const path of appconf.routes.protected) {
        if (urlPath.startsWith(path)) {
            return true
        }
    }
    return false
}
export const isPublicUrl = (urlPath: string) => {
    return !isProtectedUrl(urlPath)
}
export const isGuestUrl = (urlPath: string) => {
    for (const path of appconf.routes.guest) {
        if (urlPath.startsWith(path)) {
            return true
        }
    }
    return false
}

// export const errorResponse = (message: string, status: number = 500) =>
//     NextResponse.json(
//         {
//             success: false,
//             message: "",
//             error: "",
//         },
//         { status }
//     )
