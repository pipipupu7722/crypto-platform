"use client"

export const fetchUserTransactions = async (userId: string) => {
    const res = await fetch(`/api/dashboard/users/${userId}/transactions`)
    if (!res.ok) {
        throw new Error("Something went wrong")
    }
    return await res.json()
}
