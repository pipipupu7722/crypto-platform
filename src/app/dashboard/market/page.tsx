"use client"

import { MarketOverview } from "react-ts-tradingview-widgets"

import { theme } from "antd"
import { Content } from "antd/es/layout/layout"

const Market: React.FC = () => {
    const { token } = theme.useToken()

    return (
        <Content
            style={{
                height: "100%",
                display: "flex",
                padding: "24px 0",
                flexDirection: "column",
            }}
        >
            <Content
                style={{
                    height: "100%",
                    padding: 24,
                    background: token.colorBgContainer,
                    borderRadius: token.borderRadiusLG,
                }}
            >
                <MarketOverview
                    colorTheme="dark"
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
