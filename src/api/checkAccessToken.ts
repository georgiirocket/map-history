import { Router } from 'express'
import { Res } from '../interface/def_if'
import { AuthData, setCoockieToken, userData, createToken } from '../handlers/middleware'
import { user_controller, logsEvent_controller } from '../db/db'

const router = Router()

interface AnswRes {
    refresh_token: string
    userData: AuthData
}

router.get("/", async (req, res) => {
    try {
        let user = await user_controller.findUserById(req.userId)
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
        logsEvent_controller.logs({
            message: "Check access token route fail",
            error: err ? err.toString() : ""
        })
    }
})
export default router