import { Router } from 'express'
import BCrypt from "bcrypt"
import { logs } from '../handlers/logs'
import { Res } from '../interface/def_if'
import { AuthData, setCoockieToken, userData, createToken } from '../handlers/middleware'
import { db } from '../db/db'

const router = Router()

interface ReqData {
    login: string,
    password: string
}
interface AnswRes {
    refresh_token: string
    userData: AuthData
}

router.post("/", async (req, res) => {
    try {
        let body: ReqData = req.body
        if (!body.login || !body.password) {
            res.json(<Res<null>>{
                status: 0,
                data: null,
                error: "not access"
            })
            return
        }
        let pre = await db.users_model.findOne({ login: body.login })
        if (!pre) {
            res.json(<Res<null>>{
                status: 0,
                data: null,
                error: "not access"
            })
            return
        }
        const isMatchPassword = await BCrypt.compare(body.password, pre.password)

        if (!isMatchPassword) {
            res.json(<Res<null>>{
                status: 0,
                data: null,
                error: "not access"
            })
            return
        }
        const { accessToken, refreshToken } = createToken(pre._id)
        setCoockieToken(req, res, accessToken)
        res.json(<Res<AnswRes>>{
            status: 1,
            error: null,
            data: {
                refresh_token: refreshToken,
                userData: userData(pre)
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
            message: "Login route fail",
            error: err ? err.toString() : ""
        })
    }
})
export default router