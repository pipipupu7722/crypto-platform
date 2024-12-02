"use server"

import { Tabs } from "antd"

import SettingsTab from "@/components/cabinet/tabs/SettingsTab"
import PageContent from "@/components/layout/PageContent"
import { getSession } from "@/lib/server/session"

const Settings = async () => {
    const session = await getSession()

    return (
        <PageContent>
            <Tabs
                defaultActiveKey={"settings"}
                items={[
                    {
                        key: "settings",
                        label: "Профиль",
                        children: <SettingsTab initialUser={session.User} />,
                    },
                ]}
            />
        </PageContent>
    )
}

export default Settings
