import { serialize } from 'cookie'
import { Socket } from "socket.io"
import { Types } from 'mongoose'
import jwt from "jsonwebtoken"
import { Response, Request, NextFunction } from 'express'
import { IUser } from '../schema/user'
import { Res, ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '../interface/def_if'
import { parse } from 'cookie'

const JWTSK: string = process.env.SECRET_KEY || "111222333"

export interface AuthData {
    id: string
    nickname: string
    special_permit: string[]
    avatar: boolean
    url_avatar: string
    settings: string[]
    role: string[]
}

interface AuthSocket {
    socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
    next: (err?: Error | undefined) => void
    packet: string
    authRoute?: string[]
}
interface cookiesType {
    token?: string
}
interface decodedType {
    userId: string,
    type: string
}

export const createToken = (id: Types.ObjectId | string): { accessToken: string, refreshToken: string } => {
    return {
        accessToken: jwt.sign({
            userId: id,
            type: "access"
        }, JWTSK, { expiresIn: "12h" }),
        refreshToken: jwt.sign({
            userId: id,
            type: "refresh"
        }, JWTSK, { expiresIn: "24h" })
    }
}

export const setCoockieToken = (req: Request, res: Response, token: string) => {
    res.setHeader('Set-Cookie', serialize('token', token, {
        httpOnly: true,
        path: '/',
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
        settings: user.settings,
        role: user.role
    }
}
export const deleteCockie = (res: Response) => {
    res.clearCookie("token")
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
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

export const authSocket = ({ socket, next, packet, authRoute = [] }: AuthSocket): void => {
    try {
        if (!authRoute.includes(packet)) {
            next()
            return
        }
        let cookies: cookiesType = parse(socket.handshake.headers.cookie || '');
        if (!cookies.token) {
            throw new Error("not field token")
        }
        const decoded = jwt.verify(cookies.token, JWTSK) as decodedType
        if (decoded.type !== "access") {
            throw new Error("fail access token")
        }
        socket.data.userId = decoded.userId
        next()
    } catch (e) {
        console.log(e)
        socket.emit("updateToken")
    }
}