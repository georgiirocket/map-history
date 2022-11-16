import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { config } from "../config/default";
import { SR } from "../index"
import { toast } from 'react-toastify';
import { useActions } from './useRedux';
import {
    ReqDataSignIn,
    ResponseCheckNickname,
    RequestDataRegister,
    ResponseDataRegister,
    ResponseCheckLogin,
    ResponseDataReadyApp,
    ResponseGetImageUrl,
    ChangeActiveAvatar,
    ResRemoveAvatar,
    ResGetProfileInfo,
    ResUpdateDataProfile,
    ReqUpdateDataProfile
} from '../models/def_model'
import axios from "../axios/interceptors"
import { AxiosRequestConfig } from "axios"

interface Res<T> {
    status: 0 | 1,
    data: T,
    error: null | string
}

export interface RequestType {
    checkNickname: (p: string) => Promise<Res<null> | Res<ResponseCheckNickname>>
    checkLogin: (p: string) => Promise<Res<null> | Res<ResponseCheckLogin>>
    register: (d: RequestDataRegister) => Promise<Res<null> | Res<ResponseDataRegister>>
    checkTokenStartApp: () => void
    exit: () => void
    signIn: (x: ReqDataSignIn) => Promise<Res<null> | Res<ResponseDataRegister>>
    checkReadyApp: () => void
    uploadAvatar: (f: File, c: AxiosRequestConfig) => Promise<Res<null> | Res<string>>
    getImageUrl: () => Promise<Res<null> | Res<ResponseGetImageUrl>>
    changeActiveAvatar: (a: string) => Promise<Res<null> | Res<ChangeActiveAvatar>>
    removeAvatar: (a: string) => Promise<Res<null> | Res<ResRemoveAvatar>>
    getProfileInfo: () => Promise<Res<null> | Res<ResGetProfileInfo>>
    updateProfile: (d: ReqUpdateDataProfile) => Promise<Res<null> | Res<ResUpdateDataProfile>>
}

export const useRequest = () => {
    const {
        setLoadCheckNickname,
        setLoadCheckLogin,
        setLoadRegister,
        setUserData,
        setIsAuth,
        setLoadCheckToken,
        setLoadExit,
        setLoadSignIn,
        setReadyApp,
        setLoadProfile,
        setNewNickname
    } = useActions()
    let navigate = useNavigate()

    const request: RequestType = {
        checkNickname: async (p: string) => {
            const a: Res<null> = {
                status: 0,
                data: null,
                error: null
            }
            setLoadCheckNickname(true)
            let res = await axios.request({
                method: "get",
                url: config.apiConfig.checkNickname + p
            })
            setLoadCheckNickname(false)
            if (res.status === 500) {
                let d: Res<null> = res.data
                toast.error(d.error, { autoClose: 2000 })
                return d
            }
            if (res.statusText === "OK") {
                let d: Res<ResponseCheckNickname> = res.data
                return d
            }
            return a
        },
        checkLogin: async (p: string) => {
            const a: Res<null> = {
                status: 0,
                data: null,
                error: null
            }
            setLoadCheckLogin(true)
            let res = await axios.request({
                method: "get",
                url: config.apiConfig.checkLogin + p,
            })
            setLoadCheckLogin(false)
            if (res.status === 500) {
                let d: Res<null> = res.data
                toast.error(d.error, { autoClose: 2000 })
                return d
            }
            if (res.statusText === "OK") {
                let d: Res<ResponseCheckLogin> = res.data
                return d
            }
            return a
        },
        register: async (data: RequestDataRegister) => {
            const a: Res<null> = {
                status: 0,
                data: null,
                error: null
            }
            setLoadRegister(true)
            let res = await axios.request({
                method: "post",
                url: config.apiConfig.register,
                data: data
            })
            setLoadRegister(false)
            if (res.statusText === "OK") {
                let d: Res<ResponseDataRegister> = res.data
                SR.set(d.data.refresh_token)
                setUserData(d.data.userData)
                setIsAuth(true)
                setReadyApp(true)
                navigate(config.routes.map)
                return d
            }
            return a
        },
        checkTokenStartApp: async () => {
            setLoadCheckToken(true)
            let res = await axios.request({
                method: "get",
                url: config.apiConfig.checkAccessToken
            })
            setLoadCheckToken(false)
            if (res.statusText === "OK") {
                let d: Res<ResponseDataRegister> = res.data
                SR.set(d.data.refresh_token)
                setUserData(d.data.userData)
                setIsAuth(true)
            }
        },
        exit: async () => {
            setLoadExit(true)
            let res = await axios.request({
                method: "get",
                url: config.apiConfig.exit
            })
            setLoadExit(false)
            if (res.status === 500) {
                let d: Res<null> = res.data
                toast.error(d.error, { autoClose: 2000 })
            }
            if (res.statusText === "OK") {
                SR.set("")
                setUserData(null)
                setIsAuth(false)
                navigate(config.routes.map)
            }
        },
        signIn: async (x: ReqDataSignIn) => {
            const a: Res<null> = {
                status: 0,
                data: null,
                error: null
            }
            setLoadSignIn(true)
            let res = await axios.request({
                method: "post",
                url: config.apiConfig.login,
                data: x
            })
            setLoadSignIn(false)
            if (res.status === 500) {
                let d: Res<null> = res.data
                toast.error(d.error, { autoClose: 2000 })
                return d
            }
            if (res.statusText === "OK") {
                let d: Res<ResponseDataRegister> = res.data
                SR.set(d.data.refresh_token)
                setUserData(d.data.userData)
                setIsAuth(true)
                navigate(config.routes.map)
                return d
            }
            return a
        },
        checkReadyApp: async () => {
            let res = await axios.request({
                method: "get",
                url: config.apiConfig.checkReadyApp
            })
            if (res.status === 500) {
                let d: Res<null> = res.data
                toast.error(d.error, { autoClose: 2000 })
                return
            }
            if (res.statusText === "OK") {
                let d: Res<ResponseDataReadyApp> = res.data
                setReadyApp(d.data.ready)
            }
        },
        uploadAvatar: async (f: File, configReq) => {
            const a: Res<null> = {
                status: 0,
                data: null,
                error: null
            }
            let data = new FormData()
            data.append('file', f)
            let res = await axios.request({
                ...configReq, ...{
                    method: "post",
                    url: config.apiConfig.uploadAvatar,
                    headers: {
                        "content-type": 'multipart/form-data'
                    },
                    data: data
                }
            })
            if (res.status === 500) {
                let d: Res<null> = res.data
                toast.error(d.error, { autoClose: 2000 })
                return d
            }
            if (res.statusText === "OK") {
                let d: Res<string> = res.data
                return d
            }
            return a
        },
        getImageUrl: async () => {
            const a: Res<null> = {
                status: 0,
                data: null,
                error: null
            }
            let res = await axios.request({
                method: "get",
                url: config.apiConfig.getImageUrl
            })
            if (res.status === 500) {
                let d: Res<null> = res.data
                toast.error(d.error, { autoClose: 2000 })
                return d
            }
            if (res.statusText === "OK") {
                let d: Res<ResponseGetImageUrl> = res.data
                return d
            }
            return a
        },
        changeActiveAvatar: async (active = "") => {
            const a: Res<null> = {
                status: 0,
                data: null,
                error: null
            }
            let res = await axios.request({
                method: "get",
                url: config.apiConfig.changeImageActive,
                params: { active }
            })
            if (res.status === 500) {
                let d: Res<null> = res.data
                toast.error(d.error, { autoClose: 2000 })
                return d
            }
            if (res.statusText === "OK") {
                let d: Res<ChangeActiveAvatar> = res.data
                return d
            }
            return a
        },
        removeAvatar: async (id) => {
            const a: Res<null> = {
                status: 0,
                data: null,
                error: null
            }
            let res = await axios.request({
                method: "delete",
                url: config.apiConfig.getImage + id
            })
            if (res.status === 500) {
                let d: Res<null> = res.data
                toast.error(d.error, { autoClose: 2000 })
                return d
            }
            if (res.statusText === "OK") {
                let d: Res<ResRemoveAvatar> = res.data
                return d
            }
            return a
        },
        getProfileInfo: async () => {
            const a: Res<null> = {
                status: 0,
                data: null,
                error: null
            }
            setLoadProfile(true)
            let res = await axios.request({
                method: "get",
                url: config.apiConfig.getProfileInfo
            })
            setLoadProfile(false)
            if (res.status === 500) {
                let d: Res<null> = res.data
                toast.error(d.error, { autoClose: 2000 })
                return d
            }
            if (res.statusText === "OK") {
                let d: Res<ResGetProfileInfo> = res.data
                return d
            }
            return a
        },
        updateProfile: async (data) => {
            const a: Res<null> = {
                status: 0,
                data: null,
                error: null
            }
            setLoadProfile(true)
            let res = await axios({
                method: "put",
                url: config.apiConfig.editProfile,
                data: data,
                headers: {
                    'content-type': 'application/json'
                }
            })
            setLoadProfile(false)
            if (res.status === 500) {
                let d: Res<null> = res.data
                toast.error(d.error, { autoClose: 2000 })
                return d
            }
            if (res.statusText === "OK") {
                let d: Res<ResGetProfileInfo> = res.data
                if (d.data.nickname) {
                    setNewNickname(d.data.nickname)
                }
                return d
            }
            return a
        },
    }
    useEffect(() => {
        request.checkTokenStartApp()
        request.checkReadyApp()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return request
}







