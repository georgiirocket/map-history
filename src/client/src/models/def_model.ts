import { AuthData } from './authdata'

export interface ResponseCheckNickname {
    nickName: string
    created: boolean
}
export interface ResponseCheckLogin {
    login: string
    created: boolean
}
export interface RequestDataRegister {
    nickName: string
    login: string
    password: string
    owner: boolean
}
export interface ReqDataSignIn {
    login: string
    password: string
}
export interface ResponseDataRegister {
    refresh_token: string
    userData: AuthData
}
export interface ResponseDataReadyApp {
    ready: boolean
}
export interface DefResponseData {
    status: number
    mess: string
}
export interface ResponseGetImageUrl {
    url: string[]
}
export interface ChangeActiveAvatar {
    url_avatar: string
}
export interface ResRemoveAvatar {
    deleteId: string
}
export interface ResGetProfileInfo {
    nickname: string
    login: string
}
export interface ReqUpdateDataProfile {
    login: string
    password: string
    nickname: string
}
export interface ResUpdateDataProfile {
    nickname: string
    login: string
}

