import { Router } from 'express'
import { Res } from '../interface/def_if'
import { user_controller, logsEvent_controller } from '../db/db'
const router = Router()

interface AnswerResponse {
    ready: boolean,
}

router.get("/", async (_, res) => {
    try {
        let owner = await user_controller.checkOwner()
        let answer: Res<AnswerResponse> = {
            status: 1,
            error: null,
            data: {
                ready: false
            }
        }
        if (!owner) {
            res.json(answer)
            return
        }
        answer.data.ready = true
        res.json(answer)
    } catch (err: any) {
        const answer: Res<null> = {
            status: 0,
            data: null,
            error: err ? err.toString() : ""
        }
        res.status(500).json(answer)
        logsEvent_controller.logs({
            message: "Check owner route fail",
            error: err ? err.toString() : ""
        })
    }
})
export default router