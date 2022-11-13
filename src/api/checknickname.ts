import { Router } from 'express'
import { logs } from '../handlers/logs'
import { Res } from '../interface/def_if'
import { user_controller } from '../db/db'
const router = Router()

interface AnswerResponse {
    created: boolean,
    nickName: string
}

router.get("/:id", async (req, res) => {
    try {
        let reqNickName = req.params.id
        let user = await user_controller.checkNickname(reqNickName)
        let answer: Res<AnswerResponse> = {
            status: 1,
            error: null,
            data: {
                created: true,
                nickName: reqNickName
            }
        }
        if (user) {
            res.json(answer)
            return
        }
        answer.data.created = false
        res.json(answer)

    } catch (err: any) {
        const answer: Res<null> = {
            status: 0,
            data: null,
            error: err ? err.toString() : ""
        }
        res.status(500).json(answer)
        logs({
            message: "Check nickName route fail",
            error: err ? err.toString() : ""
        })
    }
})
export default router