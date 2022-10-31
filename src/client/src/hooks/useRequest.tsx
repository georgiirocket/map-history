import { useNavigate } from "react-router-dom"
import { config } from "../config/default";
import { SR } from "../index"
import { useActions } from './useRedux';
import {
    ReqDataSignIn,
    ResponseCheckNickname,
    RequestDataRegister,
    ResponseDataRegister,
    ResponseCheckLogin
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
        setLoadSignIn
    } = useActions()
    let navigate = useNavigate()

    const requst: RequestType = {
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
        }
    }

    return requst
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






