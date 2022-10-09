import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import { useAppSelector, useActions } from '../../hooks/useRedux'
import { useTranslation } from 'react-i18next';
import { config } from '../../config/default'

export const LanguageDialog: React.FC = () => {
    const { dialogs } = useAppSelector(state => state.global)
    const { openDialogLanguage, setLanguage } = useActions()
    const { t } = useTranslation()

    const handleListItemClick = (value: string) => {
        openDialogLanguage(false)
        setLanguage(value)
    };

    return (
        <Dialog onClose={() => openDialogLanguage(false)} fullWidth={true} maxWidth="sm" open={dialogs.language}>
            <DialogTitle textAlign="center">{t("profile.languagePlaceholder")}</DialogTitle>
            <List sx={{ pt: 0 }}>
                {config.languages.map((lang) => (
                    <ListItem button onClick={() => handleListItemClick(lang[0])} key={lang[1]}>
                        <ListItemText primary={lang[1]} />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}
