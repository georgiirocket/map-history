import { serialize } from 'cookie'
import jwt from "jsonwebtoken"
import { Response, Request, NextFunction } from 'express'
import { IUser } from '../schema/user'
import { Res } from '../interface/def_if'
import { parse } from 'cookie'
import config from 'config'

const JWTSK: string = config.get('secretKey')

export interface AuthData {
    id: string
    nickname: string
    special_permit: string[]
    avatar: boolean
    url_avatar: string
    settings: string[]
}

export const setCoockieToken = (req: Request, res: Response, token: string) => {

    res.setHeader('Set-Cookie', serialize('token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 900
        // secure: true,
        // sameSite: 'lax',
    }))
}

export const userData = (user: IUser): AuthData => {
    return {
        id: user._id.toString(),
        nickname: user.nickname,
        special_permit: user.specialpermit,
        avatar: user.avatar,
        url_avatar: user.url_avatar,
        settings: user.settings
    }
}
export const deleteCockie = (res: Response) => {
    res.clearCookie("token")
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
    interface cookiesType {
        token?: string
    }
    interface decodedType {
        userId: string,
        type: string
    }
    try {
        let cookies: cookiesType = parse(req.headers.cookie || '');
        if (!cookies.token) {
            throw new Error("not field token")
        }
        const decoded = jwt.verify(cookies.token, JWTSK) as decodedType
        if (decoded.type !== "access") {
            throw new Error("fail access token")
        }
        req.userId = decoded.userId
        next()
    } catch (e) {
        res.status(401).json(<Res<null>>{
            status: 0,
            data: null,
            error: "not auth"
        })
    }
}