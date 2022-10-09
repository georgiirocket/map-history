import { AuthData } from './authdata'
export interface ResponseCheckNickname {
    nickName: string
    created: boolean
}
export interface RequestDataRegister {
    nickName: string
    login: string
    password: string
}
export interface ResponseDataRegister {
    refresh_token: string
    userData: AuthData
}
export interface DefResponseData {
    status: number
    mess: string
}
