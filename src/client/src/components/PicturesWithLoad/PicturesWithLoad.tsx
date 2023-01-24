import React, { useState, useCallback, useEffect } from "react";
import { Controlled as ControlledZoom } from 'react-medium-image-zoom'
import Skeleton from '@mui/material/Skeleton';

import { useAppSelector } from "../../hooks/useRedux";
import { themeApp } from "../../styles/_default";
import { PicturesWithLoadProps } from "../../interface/interface_default";
import "../../sass/_pictures_with_load.scss"


export const PicturesWithLoad: React.FC<PicturesWithLoadProps> = ({
    src, styleBox, styleImg,
    widthPictures = "345",
    heightPictures = "345",
    lazyLoading = "eager",
    disabled = false
}) => {
    const [isZoomed, setIsZoomed] = useState<boolean>(false)
    const [loaded, setLoaded] = useState<boolean>(true)
    const [loadedError, setLoadedError] = useState<boolean>(false)
    const { theme } = useAppSelector(state => state.global)

    const handleZoomChange = useCallback((shouldZoom: boolean) => {
        setIsZoomed(disabled ? false : shouldZoom)
    }, [])
    const styleBackgroundOpenZoom = (): void => {
        let html = document.documentElement
        if (html) {
            html.style.cssText = html.style.cssText + `--BACKGROUND_SLIDER: ${theme === 'light' ? themeApp.WHITE_COLOR : themeApp.DARK_BACKGROUND};`
        }
    }
    useEffect(() => {
        if (isZoomed) {
            styleBackgroundOpenZoom()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isZoomed])
    return (
        <div className='ph-box' style={styleBox}>
            <ControlledZoom
                isZoomed={isZoomed}
                onZoomChange={handleZoomChange}
            >
                <img
                    alt="that wanaka tree"
                    src={src}
                    onLoad={() => setLoaded(false)}
                    onError={() => setLoadedError(true)}
                    width={widthPictures}
                    height={heightPictures}
                    style={{ ...styleImg, cursor: disabled ? "auto" : "pointer" }}
                    loading={lazyLoading}
                />
            </ControlledZoom>
            {loaded || loadedError ? (
                <Skeleton className='sckell' variant="rectangular" width="100%" height="100%">
                    {loadedError ? "Sorry, can't get picture" : ""}
                </Skeleton>
            ) : false}
        </div>
    )
}