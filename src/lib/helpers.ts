import { UserRole } from "@prisma/client"

export const hasRole = (userRoles: UserRole[], roles: UserRole[]) => {
    return userRoles.some((role) => roles.includes(role))
}

export const round = (num: number, precision: number) =>
    Math.round((num + Number.EPSILON) * 10 ** precision) / 10 ** precision
