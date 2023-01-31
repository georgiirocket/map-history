import React, { useState, useEffect } from "react";
import { v4 } from 'uuid';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ContentRightBar } from "../../components/ContentRightBar/ContentRightBar";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { PicturesWithLoad } from "../../components/PicturesWithLoad/PicturesWithLoad";
import { FullSlider } from "../../components/Dialogs/FullSlider";
import { BtnMenu } from "../../components/BtnMenu/BtnMenu";
import { Loading } from "../../components/Loading/Loading";
import { config } from "../../config/default";
import { useAppSelector } from "../../hooks/useRedux";
import { PhotoUiDialog } from "../../ui/DialogPhoto/DialogPhoto";
import { AvatarModel, MarkerPhotoModel } from "../../models/avatar";
import { PhotoUiDialogData, TypeOptions, BtnMenuData } from "../../interface/interface_default";
import defImg from "../../images/default-image.jpg"
import "../../sass/_markerbox.scss"

export const MarkerInfo: React.FC = () => {
    const { addMarkerPosition } = useAppSelector(state => state.map)
    const { isAuth } = useAppSelector(state => state.global)
    const [loading, setLoading] = useState<boolean>(false)
    const [fullSliderOpen, setFullSliderOpen] = useState<boolean>(false)
    const [photos, setPhotos] = useState<MarkerPhotoModel[]>([])
    const [addDialogPhoto, setAddDialogPhoto] = useState<boolean>(false)
    const [progressUplFile, setProgressUplFile] = useState<number>(0)
    const { t } = useTranslation()
    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const url: string = photos.find(u => u.activeScreen)?.url || ""
    const styleFlag: React.CSSProperties = photos.length ? { opacity: 1 } : { opacity: 0 }

    const towards = (p: "right" | "left") => {
        let activeIndex: number = photos.findIndex(s => s.activeScreen)
        if (activeIndex < 0) {
            return
        }
        if (p === "right" && photos[activeIndex + 1]) {
            setPhotos(prevState => prevState.
                map((s, index) => index === (activeIndex + 1) ? ({ ...s, activeScreen: true }) : ({ ...s, activeScreen: false })))
            return
        }
        if (p === "right" && !photos[activeIndex + 1]) {
            setPhotos(prevState => prevState.
                map((s, index) => index === 0 ? ({ ...s, activeScreen: true }) : ({ ...s, activeScreen: false })))
            return
        }
        if (p === "left" && photos[activeIndex - 1]) {
            setPhotos(prevState => prevState.
                map((s, index) => index === (activeIndex - 1) ? ({ ...s, activeScreen: true }) : ({ ...s, activeScreen: false })))
            return
        }
        if (p === "left" && !photos[activeIndex - 1]) {
            setPhotos(prevState => prevState.
                map((s, index) => index === (photos.length - 1) ? ({ ...s, activeScreen: true }) : ({ ...s, activeScreen: false })))
            return
        }
    }
    const changeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files.length) {
            return
        }
        const files = Array.from(e.target.files)
        const dataFile: MarkerPhotoModel[] = files.map(file => ({
            id: v4(),
            active: false,
            url: URL.createObjectURL(file),
            file: file,
            activeScreen: false
        }))
        setPhotos(prevState => {
            if (!prevState.find(u => u.activeScreen)) {
                return ([...dataFile, ...prevState]).map((u, index) => index === 0 ? ({ ...u, activeScreen: true }) : ({ ...u }))
            }
            return ([...dataFile, ...prevState])
        })
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

    const btnData: BtnMenuData[] = [
        {
            title: t("markerCreate.addPhoto"),
            handler: () => setAddDialogPhoto(true)
        },
        {
            title: t("fullSlider.title"),
            handler: () => setFullSliderOpen(true)
        }
    ]

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
                        {/* <PhotoSlider addId={"marker-slider"} width="250px" height="200px" slides={dataForDialog(photos)} /> */}
                        <div className='pictures-view'>
                            <ArrowCircleLeftIcon onClick={() => towards("left")} style={styleFlag} className="sl-icon" />
                            <div className='img-box'>
                                <PicturesWithLoad
                                    styleImg={{
                                        borderRadius: "5px",
                                        maxWidth: "100%",
                                        maxHeight: "100%"
                                    }}
                                    src={url ? url : defImg}
                                />
                            </div>
                            <ArrowCircleRightIcon onClick={() => towards("left")} style={styleFlag} className="sl-icon" />
                        </div>
                        <BtnMenu
                            sx={{ marginTop: "10px" }}
                            menuTitle={t("markerCreate.menu")}
                            size="small"
                            fullWidth={true}
                            endIcon={<ArrowDropDownIcon />}
                            data={btnData}
                        />
                    </div>
                </Loading>
                {fullSliderOpen && (<FullSlider
                    open={fullSliderOpen}
                    slides={dataForDialog(photos)}
                    closeHandler={() => setFullSliderOpen(false)}
                />)}
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