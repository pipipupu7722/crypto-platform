"use server"

import { Content } from "antd/es/layout/layout"

import UserTradeStats from "@/components/cabinet/UserTradeStats"
import StrategiesTab from "@/components/cabinet/tabs/StrategiesTab"
import PageContent from "@/components/layout/PageContent"
import PageContentWrapper from "@/components/layout/PageContentWrapper"
import { strategiesService } from "@/lib/server/services/strategies.service"
import { getSessionPayload } from "@/lib/server/session"

const Strategies = async () => {
    const session = await getSessionPayload()

    const strategies = await strategiesService.getAllByUser(session.uid)

    return (
        <PageContentWrapper>
            <UserTradeStats />

            <PageContent>
                <StrategiesTab initialStrategies={strategies} />
            </PageContent>
        </PageContentWrapper>
    )
}

export default Strategies
