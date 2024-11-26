"use client"

import { GetUsersSchemaType } from "@/schemas/dashboard/user.schemas"

export const fetchUsers = async (query: GetUsersSchemaType) => {
    const response = await fetch(
        "/api/dashboard/users?" +
            Object.entries(query)
                .map(([key, val]) => `${key}=${val}`)
                .join("&")
    )

    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return await response.json()
}
