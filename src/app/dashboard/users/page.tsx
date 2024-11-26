"use server"

import UsersTable from "@/components/dashboard/UsersTable"
import PageContent from "@/components/layout/PageContent"

const Users: React.FC = () => {
    return (
        <PageContent>
            <UsersTable />
        </PageContent>
    )
}

export default Users
