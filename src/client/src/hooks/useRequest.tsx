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

interface TypeConfig {
    url: string
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
    data?: any
}

interface Res<T> {
    status: 0 | 1,
    data: T,
    error: null | string
}

export interface RequestType {
    checkNickname: (p: string) => Promise<null | ResponseCheckNickname>
    checkLogin: (p: string) => Promise<null | ResponseCheckLogin>
    register: (d: RequestDataRegister) => Promise<null | ResponseDataRegister>
    checkTokenStartApp: () => Promise<null | ResponseDataRegister>
    exit: () => Promise<null>
    signIn: (x: ReqDataSignIn) => Promise<null | ResponseDataRegister>
    checkReadyApp: () => void
    uploadAvatar: (f: File) => Promise<Res<null> | Res<string>>
    getImageUrl: () => Promise<null | ResponseGetImageUrl>
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
            setLoadCheckNickname(true)
            let res = await fetchJson<Res<ResponseCheckNickname>>({
                url: config.apiConfig.checkNickname + p,
                method: "GET"
            })
            setLoadCheckNickname(false)
            if (res.data) {
                return res.data.data
            }
            return null
        },
        checkLogin: async (p: string) => {
            setLoadCheckLogin(true)
            let res = await fetchJson<Res<ResponseCheckLogin>>({
                url: config.apiConfig.checkLogin + p,
                method: "GET"
            })
            setLoadCheckLogin(false)
            if (res.data) {
                return res.data.data
            }
            return null
        },
        register: async (d: RequestDataRegister) => {
            setLoadRegister(true)
            let res = await fetchJson<Res<ResponseDataRegister>>({
                url: config.apiConfig.register,
                method: "POST",
                data: d
            })
            setLoadRegister(false)
            if (res.data && res.data.status) {
                SR.set(res.data.data.refresh_token)
                setUserData(res.data.data.userData)
                setIsAuth(true)
                setReadyApp(true)
                navigate(config.routes.map)
                return res.data.data
            }
            return null
        },
        checkTokenStartApp: async () => {
            setLoadCheckToken(true)
            let res = await fetchJson<Res<ResponseDataRegister>>({
                url: config.apiConfig.checkAccessToken,
                method: "GET"
            })
            setLoadCheckToken(false)
            if (res.resStatus === 401) {
                return null
            }
            if (res.data && res.data.status) {
                SR.set(res.data.data.refresh_token)
                setUserData(res.data.data.userData)
                setIsAuth(true)
                return res.data.data
            }
            return null
        },
        exit: async () => {
            setLoadExit(true)
            let res = await reqAuth<Res<null>>({
                url: config.apiConfig.exit,
                method: "GET"
            })
            setLoadExit(false)
            if (res.resOk) {
                SR.set("")
                setUserData(null)
                setIsAuth(false)
            }
            return null
        },
        signIn: async (x: ReqDataSignIn) => {
            setLoadSignIn(true)
            let res = await fetchJson<Res<ResponseDataRegister>>({
                url: config.apiConfig.login,
                method: "POST",
                data: x
            })
            setLoadSignIn(false)
            if (res.data && res.data.status) {
                SR.set(res.data.data.refresh_token)
                setUserData(res.data.data.userData)
                setIsAuth(true)
                navigate(config.routes.map)
                return res.data.data
            }
            return null
        },
        checkReadyApp: async () => {
            let res = await fetchJson<Res<ResponseDataReadyApp>>({
                url: config.apiConfig.checkReadyApp,
                method: "GET",
            })
            if (res.resStatus !== 200) {
                return
            }
            if (res.data && !res.data.data.ready) {
                setReadyApp(false)
            }
        },
        uploadAvatar: async (f: File) => {
            const a: Res<null> = {
                status: 0,
                data: null,
                error: null
            }
            try {
                let data = new FormData()
                data.append('file', f)
                let res = await fetch(config.apiConfig.uploadAvatar, {
                    method: 'POST',
                    body: data
                })
                if (res.status === 401) {
                    updateAuth()
                    toast.error("Not auth", { autoClose: 2000 })
                    return a
                }
                if (!res.ok) {
                    let resError = await res.json() as Res<null>
                    return resError
                }
                let resData = await res.json() as Res<string>
                return resData
            } catch (err: any) {
                console.error(err)
                a.error = err.toString()
                return a
            }
        },
        getImageUrl: async () => {
            let res = await reqAuth<Res<ResponseGetImageUrl>>({
                url: config.apiConfig.getImageUrl,
                method: "GET"
            })
            if (res.data) {
                return res.data.data
            }
            return null
        },
        changeActiveAvatar: async (active = "") => {
            const a: Res<null> = {
                status: 0,
                data: null,
                error: null
            }
            try {
                let res = await fetch(config.apiConfig.changeImageActive + "?" + new URLSearchParams({
                    active
                }))
                if (res.status === 401) {
                    updateAuth()
                    toast.error("Not auth", { autoClose: 2000 })
                    return a
                }
                if (!res.ok) {
                    let resError = await res.json() as Res<null>
                    return resError
                }
                let resData = await res.json() as Res<ChangeActiveAvatar>
                return resData
            } catch (err: any) {
                console.error(err)
                a.error = err.toString()
                return a
            }
        },
        removeAvatar: async (id) => {
            const a: Res<null> = {
                status: 0,
                data: null,
                error: null
            }
            try {
                let res = await fetch(config.apiConfig.getImage + id, {
                    method: "DELETE"
                })
                if (res.status === 401) {
                    updateAuth()
                    toast.error("Not auth", { autoClose: 2000 })
                    return a
                }
                if (!res.ok) {
                    let resError = await res.json() as Res<null>
                    return resError
                }
                let resData = await res.json() as Res<ResRemoveAvatar>
                return resData
            } catch (err: any) {
                console.error(err)
                a.error = err.toString()
                return a
            }
        },
        getProfileInfo: async () => {
            const a: Res<null> = {
                status: 0,
                data: null,
                error: null
            }
            setLoadProfile(true)
            try {
                let res = await fetch(config.apiConfig.getProfileInfo)
                if (res.status === 401) {
                    updateAuth()
                    toast.error("Not auth. Please, try again", { autoClose: 2000 })
                    a.error = "Not auth"
                    return a
                }
                setLoadProfile(false)
                if (!res.ok) {
                    let resError = await res.json() as Res<null>
                    toast.error(resError.error, { autoClose: 2000 })
                    console.error(resError.error)
                    return resError
                }
                let resData = await res.json() as Res<ResGetProfileInfo>
                return resData
            } catch (err: any) {
                setLoadProfile(false)
                console.error(err)
                a.error = err.toString()
                toast.error(err.toString(), { autoClose: 2000 })
                return a
            }
        },
        updateProfile: async (d) => {
            const a: Res<null> = {
                status: 0,
                data: null,
                error: null
            }
            try {
                setLoadProfile(true)
                let res = await fetch(config.apiConfig.editProfile, {
                    method: "PUT",
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(d)
                })
                setLoadProfile(false)
                if (res.status === 401) {
                    updateAuth()
                    toast.error("Not auth. Please, try again", { autoClose: 2000 })
                    a.error = "Not auth"
                    return a
                }
                if (!res.ok) {
                    let resError = await res.json() as Res<null>
                    toast.error(resError.error, { autoClose: 2000 })
                    console.error(resError.error)
                    return resError
                }
                let resData = await res.json() as Res<ResUpdateDataProfile>
                if (resData.data.nickname) {
                    setNewNickname(resData.data.nickname)
                }
                return resData
            } catch (err: any) {
                console.error(err)
                a.error = err.toString()
                toast.error(err.toString(), { autoClose: 2000 })
                return a
            }
        },
    }
    useEffect(() => {
        request.checkTokenStartApp()
        request.checkReadyApp()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return request
}

async function fetchJson<T>(c: TypeConfig) {
    type optionsType = {
        method: string,
        headers: any,
        body?: string
    }
    type answerType = {
        resOk: boolean,
        resStatus: number,
        resTypeConfig: TypeConfig,
        error: string
        data: T
    }
    type answerTypeError = {
        resOk: boolean,
        resStatus: number,
        resTypeConfig: TypeConfig,
        error: string
        data: null
    }
    const options: optionsType = {
        method: c.method,
        headers: new Headers({ 'content-type': 'application/json' }),
    }
    if (c.data) {
        options.body = JSON.stringify(c.data);
    }
    try {
        let res = await fetch(c.url, options)
        if (!res.ok) {
            let d = await res.json()
            let answ: answerTypeError = {
                resOk: false,
                resStatus: res.status,
                resTypeConfig: c,
                error: JSON.stringify(d),
                data: null
            }
            return answ
        }
        let d = await res.json()
        let answ: answerType = {
            resOk: res.ok,
            resStatus: res.status,
            resTypeConfig: c,
            error: "",
            data: d
        }
        return answ

    } catch (err: any) {
        console.error("fetch_json fail:", err)
        let answ: answerTypeError = {
            resOk: false,
            resStatus: 400,
            resTypeConfig: c,
            error: err.toString(),
            data: null
        }
        return answ
    }
}
async function reqAuth<T>(c: TypeConfig) {
    let originalConfig = c
    let res = await fetchJson<T>(originalConfig)
    if (res.resStatus !== 401) {
        return res
    }
    let resRefreshToken = await fetchJson({
        url: config.apiConfig.rehreshToken,
        method: "POST",
        data: {
            refresh_token: SR.get()
        }
    })
    if (!resRefreshToken.resOk) {
        window.location.reload()
        return res
    }
    res = await fetchJson<T>(originalConfig)
    return res
}
async function updateAuth() {
    let resRefreshToken = await fetchJson({
        url: config.apiConfig.rehreshToken,
        method: "POST",
        data: {
            refresh_token: SR.get()
        }
    })
    if (!resRefreshToken.resOk) {
        window.location.reload()
    }
}







