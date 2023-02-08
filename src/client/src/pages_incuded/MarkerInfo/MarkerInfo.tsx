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
import { deepOrange } from '@mui/material/colors';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';

import { PicturesWithLoad } from "../../components/PicturesWithLoad/PicturesWithLoad";
import { FullSlider } from "../../components/Dialogs/FullSlider";
import { BtnMenu } from "../../components/BtnMenu/BtnMenu";
import { Loading } from "../../components/Loading/Loading";
import { config } from "../../config/default";
import { useAppSelector, useActions } from "../../hooks/useRedux";
import { PhotoUiDialog } from "../../ui/DialogPhoto/DialogPhoto";
import { AvatarModel, MarkerPhotoModel } from "../../models/avatar";
import { PhotoUiDialogData, TypeOptions, BtnMenuData } from "../../interface/interface_default";
import { TextDialog } from "../../components/Dialogs/Text";
import defImg from "../../images/logo/logo.svg"
import "../../sass/_markerbox.scss"

export const MarkerInfo: React.FC = () => {
    const { addMarkerPosition, dataMarker: { photos, title, description, privat, owner } } = useAppSelector(state => state.map)
    const { isAuth, authData } = useAppSelector(state => state.global)
    const {
        setMarkerPhotos,
        setMarkerTitle,
        setMarkerDescription,
        setMarkerPrivat,
        setActivePhotoMarker,
        removePhotoMarker,
        createNewMarkerPhotos
    } = useActions()
    const [loading, setLoading] = useState<boolean>(false)
    const [fullSliderOpen, setFullSliderOpen] = useState<boolean>(false)
    const [addDialogPhoto, setAddDialogPhoto] = useState<boolean>(false)
    const [progressUplFile, setProgressUplFile] = useState<number>(0)
    const [titleDialog, setTitleDialog] = useState<boolean>(false)
    const [descriptionDialog, setDescriptionDialog] = useState<boolean>(false)
    const { t } = useTranslation()
    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const url: string = photos.find(u => u.activeScreen)?.url || ""
    const styleFlag: React.CSSProperties = photos.length > 1 ? { opacity: 1 } : { opacity: 0 }

    const towards = (p: "right" | "left") => {
        let activeIndex: number = photos.findIndex(s => s.activeScreen)
        if (activeIndex < 0) {
            return
        }
        if (p === "right" && photos[activeIndex + 1]) {
            setMarkerPhotos(photos
                .map((s, index) => index === (activeIndex + 1) ? ({ ...s, activeScreen: true }) : ({ ...s, activeScreen: false })))
            return
        }
        if (p === "right" && !photos[activeIndex + 1]) {
            setMarkerPhotos(photos
                .map((s, index) => index === 0 ? ({ ...s, activeScreen: true }) : ({ ...s, activeScreen: false })))
            return
        }
        if (p === "left" && photos[activeIndex - 1]) {
            setMarkerPhotos(photos
                .map((s, index) => index === (activeIndex - 1) ? ({ ...s, activeScreen: true }) : ({ ...s, activeScreen: false })))
            return
        }
        if (p === "left" && !photos[activeIndex - 1]) {
            setMarkerPhotos(photos
                .map((s, index) => index === (photos.length - 1) ? ({ ...s, activeScreen: true }) : ({ ...s, activeScreen: false })))
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
        createNewMarkerPhotos(dataFile)
        e.target.files = null
    }

    const dataForDialog = (p: AvatarModel[]): PhotoUiDialogData[] => p.map(u => {
        const options: TypeOptions[] = [
            [t("photoCard.btn.use"), 'u', () => setActivePhotoMarker(u.id)],
            [t("photoCard.btn.unUse"), 'un', () => setActivePhotoMarker("")],
            [t("photoCard.btn.remove"), 'r', () => removePhotoMarker(u.id)]
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
        }
    ]
    if (id !== "new") {
        btnData.push({
            title: t("fullSlider.title"),
            handler: () => setFullSliderOpen(true)
        })
    }

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
                        {titleDialog ? <TextDialog
                            startValue={title}
                            close={() => setTitleDialog(false)}
                            handler={(val) => {
                                setMarkerTitle(val)
                                setTitleDialog(false)
                            }}
                            title={t("markerCreate.title")} /> : false}
                        {descriptionDialog ? <TextDialog
                            startValue={description}
                            close={() => setDescriptionDialog(false)}
                            handler={(val) => {
                                setMarkerDescription(val)
                                setDescriptionDialog(false)
                            }}
                            title={t("markerCreate.descriprionTitle")} /> : false}
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
                        <div className="content-text">
                            <Card className="card-style avatar-box" sx={{ maxWidth: "100%" }}>
                                <CardContent className="avatar-card">
                                    {authData?.url_avatar ?
                                        <Avatar className='avatar-cust' alt={authData.nickname} src={config.apiConfig.getImage + authData.url_avatar} /> :
                                        <Avatar className='avatar-cust' sx={{ bgcolor: deepOrange[500] }}>{authData?.nickname.split('')[0] ?? 'A'}</Avatar>
                                    }
                                    <Typography className="nickname" variant="body2" color="text.secondary">
                                        {authData?.nickname || "Not name"}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="content-text">
                            <Card className="card-style" sx={{ maxWidth: "100%" }}>
                                <CardContent>
                                    <Typography gutterBottom component="div">
                                        {t("markerCreate.coordinates")}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {`Lat: ${addMarkerPosition?.latLng.lat}`}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {`Lat: ${addMarkerPosition?.latLng.lng}`}
                                    </Typography>
                                </CardContent>
                                {id !== "new" && authData?.id === owner && (<CardActions className="action-btm">
                                    <Button size="small">Edit</Button>
                                </CardActions>)}
                            </Card>
                        </div>
                        <div className="content-text">
                            <Card className="card-style" sx={{ maxWidth: "100%" }}>
                                <CardContent>
                                    <Typography gutterBottom component="div">
                                        {t("markerCreate.title")}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {title || t("markerCreate.titleInfo")}
                                    </Typography>
                                </CardContent>
                                {(id === "new" || (id !== "new" && owner === authData?.id)) && (<CardActions className="action-btm">
                                    <Button onClick={() => setTitleDialog(true)} size="small">Edit</Button>
                                </CardActions>)}
                            </Card>
                        </div>
                        <div className="content-text">
                            <Card className="card-style" sx={{ maxWidth: "100%" }}>
                                <CardContent>
                                    <Typography gutterBottom component="div">
                                        {t("markerCreate.descriprionTitle")}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {description || t("markerCreate.descriprion")}
                                    </Typography>
                                </CardContent>
                                {(id === "new" || (id !== "new" && owner === authData?.id)) && (
                                    <CardActions className="action-btm">
                                        <Button onClick={() => setDescriptionDialog(true)} size="small">Edit</Button>
                                    </CardActions>
                                )}
                            </Card>
                        </div>
                        {(id === "new" || (id !== "new" && owner === authData?.id)) && (
                            <div className="content-text">
                                <Card className="card-style" sx={{ maxWidth: "100%" }}>
                                    <CardContent>
                                        <Typography gutterBottom component="div">
                                            {t("markerCreate.settings")}
                                        </Typography>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox
                                                checked={privat}
                                                onChange={(e) => setMarkerPrivat(e.target.checked)}
                                            />} label={t("markerCreate.privat")} />
                                        </FormGroup>
                                    </CardContent>
                                    <CardActions className="action-btm">
                                        <Button onClick={() => setDescriptionDialog(true)} size="small">Edit</Button>
                                    </CardActions>
                                </Card>
                            </div>
                        )}
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