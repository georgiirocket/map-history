import { Router } from 'express'
import jwt from "jsonwebtoken"
import { logs } from '../handlers/logs'
import { Res } from '../interface/def_if'
import { AuthData, setCoockieToken, userData, createToken } from '../handlers/middleware'
import { db } from '../db/db'
import config from 'config'

const router = Router()
const JWTSK: string = config.get('secretKey')

interface AnswRes {
    refresh_token: string
    userData: AuthData
}

router.get("/", async (req, res) => {
    try {
        let user = await db.users_model.findById(req.userId)

        if (!user) {
            res.json(<Res<null>>{
                status: 0,
                data: null,
                error: "not find user"
            })
            return
        }
        const { accessToken, refreshToken } = createToken(user._id)
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