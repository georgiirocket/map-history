import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ContentRightBar } from "../../components/ContentRightBar/ContentRightBar";
import Typography from '@mui/material/Typography';

import { PhotoSlider } from "../../components/PhotoSlider/PhotoSlider";
import { Loading } from "../../components/Loading/Loading";
import { config } from "../../config/default";
import { useAppSelector } from "../../hooks/useRedux";
import "../../sass/_markerbox.scss"

export const MarkerInfo: React.FC = () => {
    const { addMarkerPosition } = useAppSelector(state => state.map)
    const { isAuth } = useAppSelector(state => state.global)
    const [loading, setLoading] = useState<boolean>(false)
    const { t } = useTranslation()
    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (id === 'new' && !addMarkerPosition) {
            navigate(config.routes.map)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, addMarkerPosition])
    useEffect(() => {
        if (id === 'new' && !isAuth) {
            navigate(config.routes.map)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isAuth])
    return (
        <ContentRightBar title={id === "new" ? t("markerCreate.create") : t("markerCreate.currentMarker")}>
            <div className="marker-box">
                <Loading active={loading}>
                    <div>
                        <Typography textAlign="center" variant="subtitle2" gutterBottom>
                            Photo
                        </Typography>
                        <PhotoSlider slides={[]} />
                    </div>
                </Loading>
            </div>
        </ContentRightBar>
    )
}