"use server"

import UserTradeStats from "@/components/cabinet/UserTradeStats"
import TradeRobotsTab from "@/components/cabinet/tabs/TradeRobotsTab"
import PageContent from "@/components/layout/PageContent"
import PageContentWrapper from "@/components/layout/PageContentWrapper"
import { tradeRobotsService } from "@/lib/server/services/tradeRobots.service"
import { getSessionPayload } from "@/lib/server/session"

const TradeRobots = async () => {
    const session = await getSessionPayload()

    const tradeRobots = await tradeRobotsService.getAllByUser(session.uid)

    return (
        <PageContentWrapper>
            <UserTradeStats />

            <PageContent>
                <TradeRobotsTab initialTradeRobots={tradeRobots} />
            </PageContent>
        </PageContentWrapper>
    )
}

export default TradeRobots
