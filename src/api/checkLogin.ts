import { Router } from 'express'
import { logs } from '../handlers/logs'
import { Res } from '../interface/def_if'
import { USERS } from "../schema/user"
const router = Router()

interface AnswerResponse {
    created: boolean,
    login: string
}

router.get("/:id", async (req, res) => {
    try {
        let login = req.params.id
        let user = await USERS.findOne({ nickname: login })
        let answer: Res<AnswerResponse> = {
            status: 1,
            error: null,
            data: {
                created: true,
                login: login
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