import { Router } from 'express'
import { logs } from '../handlers/logs'
import { Res } from '../interface/def_if'
import { deleteCockie } from '../handlers/middleware'

const router = Router()

router.get("/", async (req, res) => {
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
        logs({
            message: "Exit route fail",
            error: err ? err.toString() : ""
        })
    }
})
export default router