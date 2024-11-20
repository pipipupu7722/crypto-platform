"use client"

export const fetchTransactions = async () => {
    const res = await fetch("/api/dashboard/transactions")
    if (!res.ok) {
        throw new Error("Something went wrong")
    }
    return await res.json()
}
