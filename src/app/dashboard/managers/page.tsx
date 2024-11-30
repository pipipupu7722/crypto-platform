"use server"

import ManagersTab from "@/components/dashboard/tabs/ManagersTab"
import PageContent from "@/components/layout/PageContent"
import { usersService } from "@/lib/server/services/users.service"

const Users: React.FC = async () => {
    const managers = await usersService.getAllManagers()

    return (
        <PageContent>
            <ManagersTab initial={managers} />
        </PageContent>
    )
}

export default Users
