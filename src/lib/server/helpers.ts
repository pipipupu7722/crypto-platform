import { UserRole } from "@prisma/client"
import { JOSEError } from "jose/errors"
import "server-only"

import { BadSessionError, ServerActionError } from "../errors"
import { hasRole } from "../helpers"
import { ServerAction, ServerActionResponse } from "../types"
import { logger } from "./providers/logger"
import { appconf } from "@/appconf"

export const wrapsa = <T>(action: ServerAction<T>) => {
    return async (...args: Parameters<typeof action>): Promise<ServerActionResponse<T>> => {
        try {
            const result = await action(...args)
            return { success: true, ...result }
        } catch (error) {
            if (error instanceof ServerActionError) {
                return { success: false, error: error.message }
            } else if (error instanceof JOSEError || error instanceof BadSessionError) {
                return { success: false, error: "Unauthorized" }
            }
            logger.error(error, "Error in ServerAction")
            return { success: false, error: "Something went wrong" }
        }
    }
}

export const isProtectedUrl = (urlPath: string) => {
    for (const route of appconf.routes.protected) {
        if (urlPath.startsWith(route.path)) {
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

export const hasRouteRole = (urlPath: string, roles: UserRole[]) => {
    for (const route of appconf.routes.protected) {
        if (urlPath.startsWith(route.path)) {
            return !route.roles || hasRole(roles, route.roles)
        }
    }
    return true
}
