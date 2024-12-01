"use server"

import { Content } from "antd/es/layout/layout"

import StrategiesTab from "@/components/cabinet/StrategiesTab"
import PageContent from "@/components/layout/PageContent"
import { strategiesService } from "@/lib/server/services/strategies.service"
import { getSessionPayload } from "@/lib/server/session"

const Strategies = async () => {
    const session = await getSessionPayload()

    const strategies = await strategiesService.getAllByUser(session.uid)

    return (
        <Content style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
            {/* <UserTradeStats /> */}

            <PageContent>
                <StrategiesTab initialStrategies={strategies} />
            </PageContent>
        </Content>
    )
}

export default Strategies
