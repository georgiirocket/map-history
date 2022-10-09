import { Router } from 'express'
import jwt from "jsonwebtoken"
import { logs } from '../handlers/logs'
import { Res } from '../interface/def_if'
import { AuthData, setCoockieToken, userData } from '../handlers/middleware'
import { USERS } from "../schema/user"
import config from 'config'

const router = Router()
const JWTSK: string = config.get('secretKey')

interface AnswRes {
    refresh_token: string
    userData: AuthData
}

router.get("/", async (req, res) => {
    try {
        let user = await USERS.findById(req.userId)

        if (!user) {
            res.json(<Res<null>>{
                status: 0,
                data: null,
                error: "not find user"
            })
            return
        }

        const accessToken = jwt.sign({
            userId: user._id,
            type: "access"
        }, JWTSK, { expiresIn: 900 })
        const refreshToken = jwt.sign({
            userId: user._id,
            type: "refresh"
        }, JWTSK, { expiresIn: "12h" })

        setCoockieToken(req, res, accessToken)
        res.json(<Res<AnswRes>>{
            status: 1,
            error: null,
            data: {
                refresh_token: refreshToken,
                userData: userData(user)
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
            message: "Check access token route fail",
            error: err ? err.toString() : ""
        })
    }
})
export default router