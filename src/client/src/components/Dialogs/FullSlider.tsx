import React, { useState, useEffect } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useTranslation } from "react-i18next";
import { v4 } from 'uuid';

import { debounceSave } from '../../handlers/debaunceSave';
import { Loading } from '../../components/Loading/Loading';
import { PicturesWithLoad } from '../PicturesWithLoad/PicturesWithLoad';
import { FullSliderProps, PhotoSliderData } from '../../interface/interface_default';
import '../../sass/_dialogs_photo.scss'
import '../../sass/_fullslider.scss'

interface FullSliderStateSrc {
    id: string,
    src: string,
    activeScreen: boolean
}
const createSliderData = (s: PhotoSliderData[]): FullSliderStateSrc[] => {
    return s.map((i, index) => ({ id: v4(), src: i.url, activeScreen: index === 0 ? true : false }))
}

export const FullSlider: React.FC<FullSliderProps> = ({ slides, open, closeHandler }) => {
    const [src, setSrc] = useState<FullSliderStateSrc[]>([])
    const { t } = useTranslation()
    const url: string = src.find(u => u.activeScreen)?.src || ""

    const scrollTo = (id: string): void => {
        const elem = document.querySelector(`div[data-src-image='${id}']`)
        if (elem) {
            elem.scrollIntoView({ block: "start", behavior: "smooth" });
        }
    }
    const handlerSrc = (p: string): void => {
        setSrc(prevState => prevState.map(s => s.id === p ? ({ ...s, activeScreen: true }) : ({ ...s, activeScreen: false })))
        scrollTo(p)
    }
    const towards = (p: "right" | "left") => {
        let activeIndex: number = src.findIndex(s => s.activeScreen)
        if (activeIndex < 0) {
            return
        }
        if (p === "right" && src[activeIndex + 1]) {
            setSrc(prevState => prevState.
                map((s, index) => index === (activeIndex + 1) ? ({ ...s, activeScreen: true }) : ({ ...s, activeScreen: false })))
            scrollTo(src[activeIndex + 1].id)
            return
        }
        if (p === "right" && !src[activeIndex + 1]) {
            setSrc(prevState => prevState.
                map((s, index) => index === 0 ? ({ ...s, activeScreen: true }) : ({ ...s, activeScreen: false })))
            scrollTo(src[0].id)
            return
        }
        if (p === "left" && src[activeIndex - 1]) {
            setSrc(prevState => prevState.
                map((s, index) => index === (activeIndex - 1) ? ({ ...s, activeScreen: true }) : ({ ...s, activeScreen: false })))
            scrollTo(src[activeIndex - 1].id)
            return
        }
        if (p === "left" && !src[activeIndex - 1]) {
            setSrc(prevState => prevState.
                map((s, index) => index === (src.length - 1) ? ({ ...s, activeScreen: true }) : ({ ...s, activeScreen: false })))
            scrollTo(src[src.length - 1].id)
            return
        }
    }
    const keyHandler = (e: React.KeyboardEvent) => {
        if (e.code === "Escape") {
            closeHandler()
            return
        }
        if (e.code === "ArrowLeft") {
            towards("left")
            return
        }
        if (e.code === "ArrowRight") {
            towards("right")
            return
        }
    }
    const touchHandler = (f: number, l: number): void => {
        if ((f - l) < 0 && Math.abs((f - l)) > 100) {
            towards("left")
        }
        if ((f - l) > 0 && Math.abs((f - l)) > 100) {
            towards("right")
        }
    }
    const debTouchHandler = debounceSave(touchHandler, 300)
    const touch = (e: React.TouchEvent) => {
        const currentTouch = e.touches[0].clientX
        debTouchHandler(currentTouch)
    }
    useEffect(() => {
        if (slides.length) {
            setSrc(createSliderData(slides))
        }

    }, [])
    return (
        <Dialog
            onKeyDown={keyHandler}
            PaperProps={{
                sx: {
                    minHeight: "100%",
                    minWidth: "100%"
                }
            }}
            className="dialog-pp-container"
            fullWidth={true} open={open}>
            <Loading customClass="dpp-content fullslider-container" active={false}>
                <DialogTitle className='custom-title' textAlign="center">{t("fullSlider.title")}</DialogTitle>
                {!url ? (
                    <div className="not-photo">
                        <Typography textAlign="center" variant="subtitle2" gutterBottom>
                            {t("fullSlider.notPhoto")}
                        </Typography>
                    </div>
                ) : (
                    <div className="sl-box">
                        <div className='pictures-view'>
                            <ArrowCircleLeftIcon onClick={() => towards("left")} className="sl-icon" />
                            <div className='img-box' onTouchMove={touch}>
                                <PicturesWithLoad
                                    disabled={true}
                                    styleImg={{
                                        borderRadius: "5px",
                                        maxWidth: "100%",
                                        maxHeight: "100%"
                                    }}
                                    src={url}
                                />
                            </div>
                            <ArrowCircleRightIcon onClick={() => towards("right")} className="sl-icon" />
                        </div>
                        <div className='pictures-all'>
                            {src.map(s => {
                                return (
                                    <div
                                        onClick={() => handlerSrc(s.id)}
                                        data-src-image={s.id}
                                        className={s.activeScreen ? 'box-mini active-box-mini' : 'box-mini'}
                                        key={s.id + "slider-preview"
                                        }>
                                        <PicturesWithLoad
                                            disabled={true}
                                            styleImg={{
                                                borderRadius: "5px",
                                                objectFit: "contain",
                                                width: "100px",
                                                height: "50px"
                                            }}
                                            src={s.src}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
                <DialogActions className='btn-block'>
                    <Button onClick={closeHandler}>{t("fullSlider.close")}</Button>
                </DialogActions>
            </Loading>
        </Dialog>
    );
}
