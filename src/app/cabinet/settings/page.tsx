"use server";

import { Tabs } from "antd";
import { notFound } from "next/navigation";

import PageContent from "@/components/layout/PageContent";
import { getSession } from "@/lib/server/session";
import SettingsTab from "@/components/cabinet/tabs/SettingsTab";
import DocumentsTab from "@/components/cabinet/tabs/DocumentsTab";

const Settings = async () => {
	const { User: user } = await getSession();

	if (!user) {
		return notFound();
	}

	return (
		<PageContent>
			<Tabs
				defaultActiveKey={"settings"}
				items={[
					{
						key: "settings",
						label: "Профиль",
						children: <SettingsTab initialUser={user} />,
					},
					{
						key: "documents",
						label: "Документы",
						children: <DocumentsTab initialUser={user} />,
					},
				]}
			/>
		</PageContent>
	);
};

export default Settings;
