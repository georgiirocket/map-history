import { Router } from 'express'
import mongoose from 'mongoose';
import { Res } from '../interface/def_if'
import { user_controller, marker_controller, logsEvent_controller, db } from '../db/db'
import { NewMarkerData } from '../schema/markers';
import { upload } from "../handlers/gridFSStorage"
const router = Router()


router.post('/create', upload.array('file'), async (req, res) => {
    try {
        if (!req.files) {
            res.status(500).json({ error: "Be absent file" })
            return
        }
        const dataJson = JSON.parse(req.body.text) as NewMarkerData
        dataJson.images
        // const user = await user_controller.findUserById(req.userId)
        // user.images.unshift(req.file.id)
        // await user.save()

        res.json({ mess: "ok" })
    } catch (err: any) {
        res.status(500).json({ error: err.toString() })
        logsEvent_controller.logs({
            message: "Create marker fail",
            error: err ? err.toString() : ""
        })
    }

});

export default router