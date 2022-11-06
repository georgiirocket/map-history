import { Router } from 'express'
import { logs } from '../handlers/logs'
import { Res } from '../interface/def_if'
import { db } from '../db/db'
const router = Router()

interface AnswerResponse {
    url: string[]
}

router.get("/", async (req, res) => {
    try {
        let user = await db.users_model.findById(req.userId)
        if (!user) {
            throw new Error("not found user")
        }
        let answer: Res<AnswerResponse> = {
            status: 1,
            error: null,
            data: {
                url: user.images
            }
        }
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