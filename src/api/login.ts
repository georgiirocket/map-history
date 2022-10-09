import { Router } from 'express'
import BCrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { logs } from '../handlers/logs'
import { Res } from '../interface/def_if'
import { AuthData, setCoockieToken, userData } from '../handlers/middleware'
import { USERS } from "../schema/user"
import config from 'config'

const router = Router()
const JWTSK: string = config.get('secretKey')

interface ReqData {
    nickName: string,
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
        let checknickname = await USERS.findOne({ nickname: body.nickName })
        if (!checknickname) {
            res.json(<Res<null>>{
                status: 0,
                data: null,
                error: "not access"
            })
            return
        }
        if (!body.login || !body.password) {
            res.json(<Res<null>>{
                status: 0,
                data: null,
                error: "not access"
            })
            return
        }

        const isMatchLogin = await BCrypt.compare(body.login, checknickname.login)
        const isMatchPassword = await BCrypt.compare(body.password, checknickname.password)

        if (!isMatchLogin || !isMatchPassword) {
            res.json(<Res<null>>{
                status: 0,
                data: null,
                error: "not access"
            })
            return
        }

        const accessToken = jwt.sign({
            userId: checknickname._id,
            type: "access"
        }, JWTSK, { expiresIn: 900 })
        const refreshToken = jwt.sign({
            userId: checknickname._id,
            type: "refresh"
        }, JWTSK, { expiresIn: "12h" })

        setCoockieToken(req, res, accessToken)
        res.json(<Res<AnswRes>>{
            status: 1,
            error: null,
            data: {
                refresh_token: refreshToken,
                userData: userData(checknickname)
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