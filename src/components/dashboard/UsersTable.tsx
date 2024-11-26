"use client"

import { User } from "@prisma/client"
import { Button, Input, Pagination, Table, TableProps } from "antd"
import { format } from "date-fns"
import { parsePhoneNumber } from "libphonenumber-js/min"
import Link from "next/link"
import { useEffect, useState } from "react"

import ClickToCopy from "../misc/ClickToCopy"
import CountryFlag from "../misc/CountryFlag"
import { UserStatusTag } from "../misc/Tags"
import { fetchUsers } from "@/lib/client/dashboard/fetchUsers"
import { useNotify } from "@/providers/NotificationProvider"

const UsersTable: React.FC = () => {
    const [users, setUsers] = useState<User[] | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    const [searchQuery, setSearchQuery] = useState("")
    const [totalCount, setTotalCount] = useState(0)
    const [pageSize, setPageSize] = useState(50)
    const [page, setPage] = useState(1)
    const [sortBy, setSortBy] = useState<"status" | "createdAt">("status")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

    const { notify } = useNotify()

    let searchTimeout: NodeJS.Timeout | null = null

    useEffect(() => {
        const fetchUsersData = async () => {
            setLoading(true)
            try {
                const res = await fetchUsers({ searchQuery, sortBy, sortOrder, page, pageSize })
                setUsers(res.users)
                setTotalCount(res.totalCount)
            } catch (error) {
                notify.error({ message: "Something went wrong" })
            } finally {
                setLoading(false)
            }
        }
        fetchUsersData()
    }, [page, pageSize, searchQuery, sortBy, sortOrder])

    const columns: TableProps<User>["columns"] = [
        {
            title: "Email",
            key: "email",
            render: (_, rec) => <ClickToCopy>{rec.email}</ClickToCopy>,
        },
        {
            title: "Имя Фамилия",
            key: "type",
            render: (_, rec) => <ClickToCopy>{(rec.firstName ?? "N/A") + " " + (rec.lastName ?? "N/A")}</ClickToCopy>,
        },
        {
            title: "Страна и телефон",
            key: "phone",
            render: (_, rec) => (
                <ClickToCopy text={rec.phone}>
                    {rec.country ? <CountryFlag country={rec.country} /> : "N/A"}
                    &nbsp;
                    {rec.phone ? parsePhoneNumber(rec.phone).formatInternational() : "N/A"}
                </ClickToCopy>
            ),
        },
        {
            title: "Статус",
            key: "status",
            sorter: true,
            render: (_, rec) => <UserStatusTag status={rec.status} />,
        },
        {
            title: "Дата регистрации",
            key: "date",
            sorter: true,
            render: (_, rec) => <>{format(rec.createdAt, "dd-MM-yyyy HH:mm:ss")}</>,
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, rec) => (
                <Link href={`/dashboard/users/${rec.id}`}>
                    <Button type="primary" size="small">
                        Управление
                    </Button>
                </Link>
            ),
        },
    ]

    return (
        <>
            <Input
                placeholder="Поиск по email или ФИО"
                style={{ marginBottom: 16, width: 300 }}
                onChange={(event) => {
                    if (searchTimeout) {
                        clearTimeout(searchTimeout)
                    }
                    searchTimeout = setTimeout(() => {
                        setPage(1)
                        setSearchQuery(event.target.value)
                    }, 500)
                }}
            />

            <Table<User>
                columns={columns}
                rowKey={(user) => user.id}
                dataSource={users}
                pagination={false}
                loading={loading}
                onChange={(pagination, filters, sorter, extra) => {
                    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter

                    setPage(pagination.current || 1)
                    if (singleSorter?.field) {
                        setSortBy(singleSorter.field as "status" | "createdAt")
                    }
                    if (singleSorter?.order) {
                        setSortOrder(singleSorter.order === "ascend" ? "asc" : "desc")
                    }
                }}
            />

            <div style={{ width: "100%", paddingTop: 10, display: "flex", justifyContent: "end" }}>
                <Pagination
                    current={page}
                    pageSize={pageSize}
                    total={totalCount}
                    onChange={(page) => setPage(page)}
                    showSizeChanger={false}
                    responsive
                />
            </div>
        </>
    )
}

export default UsersTable
