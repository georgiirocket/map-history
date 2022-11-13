import { Router } from 'express'
import { Res } from '../interface/def_if'
import { deleteCockie } from '../handlers/middleware'
import { logsEvent_controller } from "../db/db"

const router = Router()

router.get("/", async (_, res) => {
    try {
        deleteCockie(res)
        res.json(<Res<null>>{
            status: 1,
            error: null,
            data: null
        })
    } catch (err: any) {
        const answer: Res<null> = {
            status: 0,
            data: null,
            error: err ? err.toString() : ""
        }
        res.status(500).json(answer)
        logsEvent_controller.logs({
            message: "Exit route fail",
            error: err ? err.toString() : ""
        })
    }
})
export default router