import React from 'react';
import CSS from 'csstype';
import { AuthData } from '../models/authdata'
import { Socket } from "socket.io-client";
import { AvatarModel, MarkerPhotoModel } from "../models/avatar"

export interface ServerToClientEvents {

}

export interface ClientToServerEvents {
    hello: (p: string) => void;
    uploadProfileImage: ({ file, nameFile }: { file: File, nameFile: string }) => void;
}

export type MarkerPosition = [number, number] | null
export type MapRightBar = "hide" | "right" | "center"
export interface AddMarkerPositionType {
    latLng: {
        lat: number,
        lng: number
    },
    zoom: number
}

interface LoadingAppType {
    [key: string]: boolean;
}

export interface LoadingApp extends LoadingAppType {
    loading: boolean
    loadChecknickname: boolean
    loadCheckLogin: boolean
    loadRegister: boolean
    loadCheckToken: boolean
    loadExit: boolean
    loadSignIn: boolean
    loadingProfile: boolean
}
export interface GlobalInit {
    readyApp: boolean
    load: LoadingApp
    isAuth: boolean
    authData: null | AuthData,
    socket: null | Socket<ServerToClientEvents, ClientToServerEvents>,
    navBar: boolean,
    theme: string
    language: string
    isKeyboardMobile: boolean,
    dialogs: {
        language: boolean,
        profilePhoto: boolean
    }
}
export interface AboutInit {
    openBox: string | false
    scrollMemory: number
}
export interface SupportInit {
    miniPage: number,
    topic: string
}
export interface ProfileInit {
    scrollMemory: number
}
export interface MarkerMainBox {
    photos: AvatarModel[]
}
export interface MapInit {
    createMarkerMod: boolean,
    mapBar: boolean,
    scrollMapBar: number,
    myLocalPosition: MarkerPosition,
    alertMap: string,
    mapRightBar: MapRightBar,
    addMarkerPosition: null | AddMarkerPositionType
    stopPosition: null | AddMarkerPositionType,
    lastlocation: string,
    activeMarker: MarkerMainBox,
    dataMarker: {
        photos: MarkerPhotoModel[],
        title: string,
        description: string,
        privat: boolean,
        owner: string,
        markerPosition: null | AddMarkerPositionType
    }
}

export interface TowardsPosition {
    position: [number, number],
    zoom: number
}

export type TypeOptions = [string, string, () => void]

export interface PhotoUiDialogData {
    id: string,
    url: string,
    active: boolean,
    options: TypeOptions[],
    specialFilter?: (p: TypeOptions[]) => TypeOptions[]
}

export interface PhotoUiDialogProps {
    fullWidth?: boolean,
    open?: boolean,
    activeLoading: boolean,
    progressUplFile?: number,
    title: string,
    cssTimeout?: number,
    data: PhotoUiDialogData[],
    closeHandler: () => void,
    changeFile: (e: React.ChangeEvent<HTMLInputElement>) => void,
    closeBtnTitle: string,
    addBtnTitle: string,
    multiple?: boolean
}

export interface PicturesWithLoadProps {
    src: string,
    styleBox?: CSS.Properties,
    styleImg?: CSS.Properties,
    lazyLoading?: "eager" | "lazy",
    disabled?: boolean,
}

export interface PhotoSliderData {
    url: string,
    caption?: string
}

export interface PhotoSliderProps {
    slides: PhotoSliderData[],
    width?: string,
    height?: string,
    scrollStap?: number,
    addId: string
}

export interface PayloadActiveMarker {
    photos?: AvatarModel[]
}

export interface BtnMenuData {
    title: string,
    handler: () => void
}

export interface BtnMenuProps {
    menuTitle?: string,
    data: BtnMenuData[],
    fullWidth?: boolean,
    variant?: "contained" | "outlined" | "text",
    size?: "large" | "medium" | "small"
    startIcon?: React.ReactNode | undefined
    endIcon?: React.ReactNode | undefined,
    sx?: React.CSSProperties
}

export interface FullSliderProps {
    open: boolean,
    slides: PhotoSliderData[],
    closeHandler: () => void
}