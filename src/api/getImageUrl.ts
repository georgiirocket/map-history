import { Router, Request } from 'express'
import { Res } from '../interface/def_if'
import { user_controller, logsEvent_controller } from '../db/db'
const router = Router()

interface AnswerResponse {
    url: string[]
}
interface AnswerResponseActiveAvatar {
    url_avatar: string
}
interface ReqQueryActiveImage {
    active: string
}
router.get("/", async (req, res) => {
    try {
        let user = await user_controller.findUserById(req.userId)
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
        logsEvent_controller.logs({
            message: "Check nickName route fail",
            error: err ? err.toString() : ""
        })
    }
})
router.get("/active", async (req: Request<{}, {}, {}, ReqQueryActiveImage>, res) => {
    try {
        let query = req.query, hasActiveProperty = "active" in query

        if (!hasActiveProperty) {
            throw new Error(`not found field "active"`)
        }
        let user = await user_controller.findUserById(req.userId)
        if (!user.images.includes(query.active) && query.active) {
            throw new Error("not found picture id in user")
        }
        const answer: Res<AnswerResponseActiveAvatar> = {
            status: 1,
            error: null,
            data: {
                url_avatar: ""
            }
        }
        user.url_avatar = query.active
        await user.save()
        if (!query.active) {
            res.json(answer)
            return
        }
        answer.data.url_avatar = query.active
        res.json(answer)
    } catch (err: any) {
        const answer: Res<null> = {
            status: 0,
            data: null,
            error: err ? err.toString() : ""
        }
        res.status(500).json(answer)
        logsEvent_controller.logs({
            message: "Active photo route fail",
            error: err ? err.toString() : ""
        })
    }
})
export default router