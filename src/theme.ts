// src/theme.ts
import { theme } from "antd"
import "antd/es/theme/interface"

export const themeConfig = {
    algorithm: theme.defaultAlgorithm,
    token: {
        ...theme.defaultConfig?.token,
        fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Roboto', 'Arial', sans-serif",
        colorPrimary: "#F7A600",
        colorLink: "#F7A600",
        colorBgSolid: "#111111",
        colorBgLayout: "#F5F7FA",
        colorBgSider: "#2C2E30",
        colorBgHeader: "#17181E",
        colorBgHeaderButton: "#121214",
    },
}

export const breakpoints = {
    xs: "480px",
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px",
    xxl: "1600px",
}
