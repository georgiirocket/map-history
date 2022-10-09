import React, { useEffect } from 'react';
import { useAppSelector } from '../hooks/useRedux';
import { config } from '../config/default'
import i18n from '../i18n';

type Props = {
    children: JSX.Element | JSX.Element[]
}

export const SubscribeProvider: React.FC<Props> = ({ children }) => {
    const { language } = useAppSelector((state) => state.global)
    useEffect(() => {
        if (config.languages.find(l => l[0] === language)) {
            i18n.changeLanguage(language)
            localStorage.setItem('lang', language)
        }
    }, [language])
    return <> {children} </>
}