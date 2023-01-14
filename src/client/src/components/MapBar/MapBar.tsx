import React, { useEffect, useCallback } from "react";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import AppsIcon from '@mui/icons-material/Apps';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Button from '@mui/material/Button';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import $ from 'jquery'

import { useAppSelector, useActions } from '../../hooks/useRedux'
import { useTranslation } from "react-i18next";
import { themeApp } from "../../styles/_default";
import { getMyLocation } from '../Leaflet/Leaflet'
import '../../sass/_mapbar.scss'

type ParamsScrollHandler = "left" | "right"

export const MapBar: React.FC = () => {
    const { mapBar, scrollMapBar, createMarkerMod } = useAppSelector(state => state.map)
    const globalState = useAppSelector(state => state.global)
    const { setMapBar, setScrollMapBar, setCreateMarkerMod } = useActions()
    const { t } = useTranslation()
    const scrollHandler = (par: ParamsScrollHandler) => {
        let scrollElement = document.querySelector('.scroll')
        if (scrollElement) {
            let currentScroll: number = $(scrollElement).scrollLeft() ?? 0
            if (par === "left") {
                $(scrollElement).animate({ scrollLeft: currentScroll - 150 }, 200)
                setScrollMapBar(currentScroll - 150)
            } else {
                $(scrollElement).animate({ scrollLeft: currentScroll + 150 }, 200)
                setScrollMapBar(currentScroll + 150)
            }
        }
    }
    const setLeftScroll = useCallback(() => {
        if (scrollMapBar) {
            let scrollElement = document.querySelector('.scroll')
            if (scrollElement) {
                $(scrollElement).animate({ scrollLeft: scrollMapBar }, 200)
            }
        }
    }, [scrollMapBar])
    useEffect(() => {
        if (mapBar) {
            setLeftScroll()
        }
    }, [mapBar, setLeftScroll])
    return (
        <div
            className={`mb-container ${mapBar ? '' : 'hide-mb'}`}>
            <AppMenu />
            {mapBar ?
                <ArrowCircleLeftIcon
                    style={{ color: themeApp.ORANGE_COLOR }}
                    onClick={() => setMapBar(false)} />
                : <ArrowCircleRightIcon onClick={() => setMapBar(true)} />
            }
            {mapBar ? (
                <div
                    className="mb-scroll-container">
                    <ArrowLeftIcon onClick={() => scrollHandler("left")} />
                    <div className="scroll">
                        <Button
                            onClick={getMyLocation}
                            startIcon={<LocationSearchingIcon />}>{t("mapPage.mapBar.btn.myLocation")}</Button>
                        {globalState.isAuth ? (
                            <><Button
                                style={createMarkerMod ? { color: themeApp.ORANGE_COLOR } : {}}
                                onClick={() => setCreateMarkerMod(!createMarkerMod)}
                                startIcon={<AddLocationAltIcon />}>{t("mapPage.mapBar.btn.addMarkerMod")}</Button>
                                <Button startIcon={<LibraryBooksIcon />}>{t("mapPage.mapBar.btn.myMarkers")}</Button></>
                        ) : false}

                    </div>
                    <ArrowRightIcon onClick={() => scrollHandler("right")} />
                </div>
            ) : false
            }
        </div >
    )
}


function AppMenu() {
    const { createMarkerMod } = useAppSelector(state => state.map)
    const { setCreateMarkerMod, setMapRightBar } = useActions()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { t } = useTranslation()
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                className="cust-icon-btn"
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <AppsIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: 48 * 4.5,
                        width: '20ch',
                    },
                }}
            >
                <MenuItem onClick={handleClose}>
                    <Typography noWrap variant="inherit">
                        {t("mapPage.mapBar.btn.myMarkers")}
                    </Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                    setCreateMarkerMod(!createMarkerMod)
                    handleClose()
                }}>
                    <Typography noWrap variant="inherit">
                        {t("mapPage.mapBar.btn.addMarkerMod")}
                    </Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                    getMyLocation()
                    handleClose()
                }}>
                    <Typography noWrap variant="inherit">
                        {t("mapPage.mapBar.btn.myLocation")}
                    </Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                    setMapRightBar("right")
                    handleClose()
                }}>
                    <Typography noWrap variant="inherit">
                        {t("mapPage.mapBar.btn.mapRightBar")}
                    </Typography>
                </MenuItem>
            </Menu>
        </div>
    );
}