import React, { useState, useEffect } from "react";
import { v4 } from 'uuid';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ContentRightBar } from "../../components/ContentRightBar/ContentRightBar";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { PhotoSlider } from "../../components/PhotoSlider/PhotoSlider";
import { Loading } from "../../components/Loading/Loading";
import { config } from "../../config/default";
import { useAppSelector } from "../../hooks/useRedux";
import { PhotoUiDialog } from "../../ui/DialogPhoto/DialogPhoto";
import { AvatarModel, MarkerPhotoModel } from "../../models/avatar";
import { PhotoUiDialogData, TypeOptions } from "../../interface/interface_default";
import "../../sass/_markerbox.scss"

export const MarkerInfo: React.FC = () => {
    const { addMarkerPosition } = useAppSelector(state => state.map)
    const { isAuth } = useAppSelector(state => state.global)
    const [loading, setLoading] = useState<boolean>(false)
    const [photos, setPhotos] = useState<MarkerPhotoModel[]>([])
    const [addDialogPhoto, setAddDialogPhoto] = useState<boolean>(false)
    const [progressUplFile, setProgressUplFile] = useState<number>(0)
    const { t } = useTranslation()
    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    const changeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files.length) {
            return
        }
        const files = Array.from(e.target.files)
        const dataFile: MarkerPhotoModel[] = files.map(file => ({
            id: v4(),
            active: false,
            url: URL.createObjectURL(file),
            file: file
        }))
        setPhotos(prevState => ([...dataFile, ...prevState]))
        e.target.files = null
    }
    const dataForDialog = (p: AvatarModel[]): PhotoUiDialogData[] => p.map(u => {
        const options: TypeOptions[] = [
            [t("photoCard.btn.use"), 'u', () => console.log("use")],
            [t("photoCard.btn.unUse"), 'un', () => console.log("unuse")],
            [t("photoCard.btn.remove"), 'r', () => console.log("remove")]
        ]
        const sf = (p: TypeOptions[]): TypeOptions[] => {
            return u.active ? p.filter(o => o[1] !== 'u') : p.filter(o => o[1] !== 'un')
        }
        return ({
            ...u,
            options,
            specialFilter: sf,
            url: id === "new" ? u.url : config.apiConfig.getImage + u.url
        })
    }, [])

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
                        {/* <Typography textAlign="center" variant="subtitle2" gutterBottom>
                            Photo
                        </Typography> */}
                        <PhotoSlider width="250px" height="200px" slides={dataForDialog(photos)} />
                        <Button size="small" sx={{ marginTop: "10px" }} onClick={() => setAddDialogPhoto(true)} fullWidth variant="contained">{t("markerCreate.addPhoto")}</Button>
                    </div>
                </Loading>
                <PhotoUiDialog
                    open={addDialogPhoto}
                    activeLoading={loading}
                    multiple={true}
                    progressUplFile={progressUplFile}
                    title={t("markerCreate.titleAddPhoto")}
                    closeBtnTitle={t("profile.btn.close")}
                    addBtnTitle={t("profile.btn.addPhoto")}
                    closeHandler={() => setAddDialogPhoto(false)}
                    data={dataForDialog(photos)}
                    changeFile={changeFile} />
            </div>
        </ContentRightBar>
    )
}