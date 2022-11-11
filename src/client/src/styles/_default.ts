import React from 'react'
interface ThemeApp {
    DARK_BACKGROUND: string
    DARK_COLOR: string
    DARK_BORDERCOLOR: string
    ORANGE_COLOR: string
    BRAWN_COLOR: string
    RED_COLOR: string
    BLACK_COLOR: string
    GREEN_COLOR_BTN: string
    WHITE_COLOR: string
    COLOR_TEXT_LIGT_IN_DARK: string
    DELAY_SHOW_MENU: number
    DELAY_ANIMATE_NAMESPACE: number
    BACKGROUND_NAV: string
    DARK_BACKGROUND_MUI: string
    BORDER_COLOR_DEFAULT: string
    BORDER_COLOR_FOCUS_DEFAULT: string
    MAP_RIGHT_BAR_HIDE: number
    SOFT_RED_COLOR: string
}
export const themeApp: ThemeApp = {
    DARK_BACKGROUND: "#232529",
    DARK_COLOR: '#868d9a',
    DARK_BORDERCOLOR: '#35383f',
    ORANGE_COLOR: '#f2711c',
    BRAWN_COLOR: '#DB7F0F',
    RED_COLOR: '#DB430F',
    BLACK_COLOR: '#000000',
    GREEN_COLOR_BTN: '#00e676',
    WHITE_COLOR: "#fff",
    COLOR_TEXT_LIGT_IN_DARK: '#e2e3e7',
    DELAY_SHOW_MENU: 1000,
    DELAY_ANIMATE_NAMESPACE: 250,
    BACKGROUND_NAV: "#3770EE", //#A5A5A5 ..#464451 #379FEE
    // BACKGROUND_NAV: "#2d3040",
    DARK_BACKGROUND_MUI: "rgb(18, 18, 18)",
    BORDER_COLOR_DEFAULT: "#bdbdbd",
    BORDER_COLOR_FOCUS_DEFAULT: "#1976d2",
    MAP_RIGHT_BAR_HIDE: 300,
    SOFT_RED_COLOR: "#9B2D30"
}
export const themeCreate = (data: ThemeApp): React.CSSProperties => {
    return Object.entries(data).reduce((acc, p) => ({ ...acc, [`--${p[0]}`]: p[1] }), {})
}