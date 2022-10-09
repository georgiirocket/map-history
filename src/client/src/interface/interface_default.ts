import { AuthData } from '../models/authdata'
import { Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from './socket_int'

export type MarkerPosition = [number, number] | null
export type MapRightBar = "hide" | "right" | "center"
export interface AddMarkerPositionType {
    latLng: {
        lat: number,
        lng: number
    },
    zoom: number
}

export interface LoadingApp {
    loading: boolean
    loadChecknickname: boolean
    loadRegister: boolean
    loadCheckToken: boolean
    loadExit: boolean
    loadSignIn: boolean
}
export interface GlobalInit {
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
export interface MapInit {
    createMarkerMod: boolean,
    mapBar: boolean,
    scrollMapBar: number,
    myLocalPosition: MarkerPosition,
    alertMap: string,
    mapRightBar: MapRightBar,
    addMarkerPosition: null | AddMarkerPositionType
    stopPosition: null | AddMarkerPositionType
}