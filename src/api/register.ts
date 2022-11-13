import { Router } from 'express'
import BCrypt from "bcrypt"
import { Res } from '../interface/def_if'
import { AuthData, setCoockieToken, userData, createToken } from '../handlers/middleware'
import { logsEvent_controller, user_controller } from '../db/db'

const router = Router()

interface ReqData {
    nickName: string,
    login: string,
    password: string
    owner: boolean
}
interface AnswRes {
    refresh_token: string
    userData: AuthData
}

router.post("/", async (req, res) => {
    try {
        let body: ReqData = req.body
        let checknickname = await user_controller.checkNickname(body.nickName)
        if (checknickname) {
            res.json(<Res<null>>{
                status: 0,
                data: null,
                error: "NickName already exist"
            })
            return
        }
        if (!body.login || !body.password) {
            res.json(<Res<null>>{
                status: 0,
                data: null,
                error: "Small lenght login or password"
            })
            return
        }
        const hashPass = await BCrypt.hash(body.password, 12)

        const newUser = await user_controller.createUser({
            nickname: body.nickName,
            login: body.login,
            password: hashPass,
            owner: body.owner
        })
        const { accessToken, refreshToken } = createToken(newUser._id)
        setCoockieToken(req, res, accessToken)
        res.json(<Res<AnswRes>>{
            status: 1,
            error: null,
            data: {
                refresh_token: refreshToken,
                userData: userData(newUser)
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
            message: "Register route fail",
            error: err ? err.toString() : ""
        })
    }
})
export default router