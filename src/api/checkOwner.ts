import { Router } from 'express'
import { logs } from '../handlers/logs'
import { Res } from '../interface/def_if'
import { USERS } from "../schema/user"
const router = Router()

interface AnswerResponse {
    ready: boolean,
}

router.get("/", async (_, res) => {
    try {
        let owner = await USERS.findOne({ role: { $all: ["owner"] } })
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
        logs({
            message: "Check owner route fail",
            error: err ? err.toString() : ""
        })
    }
})
export default router