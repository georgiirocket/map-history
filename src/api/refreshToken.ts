import { Router } from 'express'
import jwt from "jsonwebtoken"
import { Res } from '../interface/def_if'
import { setCoockieToken, createToken } from '../handlers/middleware'
import { logsEvent_controller } from "../db/db"

const router = Router()
const JWTSK: string = process.env.SECRET_KEY || "111222333"

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
        const { accessToken, refreshToken } = createToken(decoded.userId)
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
        logsEvent_controller.logs({
            message: "Refresh token route fail",
            error: err ? err.toString() : ""
        })
    }
})
export default router