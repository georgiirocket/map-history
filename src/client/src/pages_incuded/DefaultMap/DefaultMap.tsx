import React from "react";
import { useTranslation } from "react-i18next";
import { ContentRightBar } from "../../components/ContentRightBar/ContentRightBar";
import Typography from '@mui/material/Typography';
import Typed from 'react-typed';

export const DefaultMap: React.FC = () => {
    const { t } = useTranslation()
    return (
        <ContentRightBar title={t("pageIncluded.defaultMap.title")}>
            <Typography variant="body2" gutterBottom>
                <Typed strings={[t("pageIncluded.defaultMap.descriprion")]} typeSpeed={10} />
            </Typography>
        </ContentRightBar>
    )
}