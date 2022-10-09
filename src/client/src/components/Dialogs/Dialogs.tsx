import React from 'react';

import { LanguageDialog } from './Language'
import { PhotoDialogs } from './Photo'
import { useAppSelector } from '../../hooks/useRedux';

export const Dialogs: React.FC = () => {
    const { dialogs } = useAppSelector(state => state.global)
    return (
        <>
            {dialogs.language ? <LanguageDialog /> : false}
            {dialogs.profilePhoto ? <PhotoDialogs /> : false}
        </>
    );
}
