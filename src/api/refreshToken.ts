import { Router } from 'express'
import jwt from "jsonwebtoken"
import { logs } from '../handlers/logs'
import { Res } from '../interface/def_if'
import { setCoockieToken } from '../handlers/middleware'
import config from 'config'

const router = Router()
const JWTSK: string = config.get('secretKey')

interface ReqAndResponseType {
    refresh_token: string
}
interface decodedType {
    userId: string,
    type: string
}

router.post("/", async (req, res) => {
    try {
        let body: ReqAndResponseType = req.body
        const decoded = jwt.verify(body.refresh_token, JWTSK) as decodedType
        if (decoded.type !== "refresh") {
            res.status(401).json(<Res<null>>{
                status: 0,
                data: null,
                error: "not auth"
            })
            return
        }
        const accessToken = jwt.sign({
            userId: decoded.userId,
            type: "access"
        }, JWTSK, { expiresIn: 900 })
        const refreshToken = jwt.sign({
            userId: decoded.userId,
            type: "refresh"
        }, JWTSK, { expiresIn: "12h" })

        setCoockieToken(req, res, accessToken)
        res.json(<Res<ReqAndResponseType>>{
            status: 1,
            error: null,
            data: {
                refresh_token: refreshToken,
            }
        })

    } catch (err: any) {
        const answer: Res<null> = {
            status: 0,
            data: null,
            error: err ? err.toString() : ""
        }
        res.status(500).json(answer)
        logs({
            message: "Refresh token route fail",
            error: err ? err.toString() : ""
        })
    }
})
export default router