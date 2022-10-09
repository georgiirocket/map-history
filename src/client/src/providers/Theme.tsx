import React, { useEffect } from 'react';
import { useAppSelector } from '../hooks/useRedux';
import { ThemeProvider as TP, createTheme } from '@mui/material/styles';
import { themeApp } from '../styles/_default'
type Props = {
    children: JSX.Element | JSX.Element[]
}

export const ThemeProvider: React.FC<Props> = ({ children }) => {
    const globalState = useAppSelector((state) => state.global)
    const theme = createTheme({
        palette: {
            mode: globalState.theme === 'light' ? 'light' : 'dark',

        },
    });
    const changeHtmlBackround = (th: string): void => {
        let html = document.querySelector('html')
        if (html) {
            if (th === 'light') {
                html.style.background = themeApp.WHITE_COLOR
                html.style.color = themeApp.BLACK_COLOR
                html.setAttribute('data-theme-html', th)
            } else {
                html.style.background = themeApp.DARK_BACKGROUND
                html.style.color = themeApp.WHITE_COLOR
                html.setAttribute('data-theme-html', th)
            }
        }
    }
    useEffect(() => {
        changeHtmlBackround(globalState.theme)
    }, [globalState.theme])
    return <TP theme={theme}> {children} </TP>
}