"use client"

import { css } from "@emotion/css"
import { theme } from "antd"
import { Content } from "antd/es/layout/layout"
import { MarketOverview } from "react-ts-tradingview-widgets"

import { breakpoints } from "@/theme"

const Market: React.FC = () => {
    const { token } = theme.useToken()

    return (
        <Content
            className={css`
                height: 100%;
                display: flex;
                flex-direction: column;
            `}
        >
            <Content
                className={css`
                    height: 100%;
                    padding: 24px;
                    background: ${token.colorBgContainer};
                    border-radius: ${token.borderRadiusLG};

                    @media (max-width: ${breakpoints.md}) {
                        padding: 12px;
                    }
                `}
            >
                <MarketOverview
                    colorTheme="light"
                    locale="ru"
                    width="100%"
                    height="100%"
                    isTransparent={true}
                    showFloatingTooltip={true}
                    copyrightStyles={{
                        parent: { display: "none" },
                        link: { display: "none" },
                        span: { display: "none" },
                    }}
                    tabs={[
                        {
                            title: "Crypto",
                            symbols: [
                                { s: "COINBASE:BTCUSD" },
                                { s: "COINBASE:ETHUSD" },
                                { s: "BINANCE:BNBUSD" },
                                { s: "BINANCE:TONUSD" },
                                { s: "COINBASE:XRPUSD" },
                                { s: "COINBASE:LTCUSD" },
                                { s: "COINBASE:EOSUSD" },
                                { s: "COINBASE:SOLUSD" },
                                { s: "COINBASE:POLUSD" },
                                { s: "COINBASE:DOGEUSD" },
                                { s: "COINBASE:SHIBUSD" },
                                { s: "COINBASE:AVAXUSD" },
                                { s: "COINBASE:DOTUSD" },
                                { s: "COINBASE:SUIUSD" },
                                { s: "COINBASE:BCHUSD" },
                            ],
                            originalTitle: "Crypto",
                        },
                    ]}
                ></MarketOverview>
            </Content>
        </Content>
    )
}

export default Market
