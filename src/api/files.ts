import { Router } from 'express'
import mongoose from 'mongoose';
import { Res } from '../interface/def_if'
import { user_controller, logsEvent_controller, db } from '../db/db'
import { upload } from "../handlers/gridFSStorage"
const router = Router()

interface AnswerDeleteAvatar {
    deleteId: string
}

router.post('/avatar/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            const answer: Res<null> = {
                status: 0,
                data: null,
                error: "not acsess uload file"
            }
            res.status(500).json(answer)
            return
        }
        const user = await user_controller.findUserById(req.userId)
        user.images.unshift(req.file.id)
        await user.save()
        const answer: Res<string> = {
            status: 1,
            data: req.file.id,
            error: null
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
            message: "Get avatar route fail",
            error: err ? err.toString() : ""
        })
    }

});
router.get("/getavatar/:id", async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        db.getGfs().files.findOne({ _id: id, metadata: { ondelete: false } }, (err, file) => {
            if (!file || file.length === 0) {
                return res.status(404).json({
                    err: 'No file exists'
                });
            }
            if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/jpg') {
                // Read output to browser
                const readstream = db.getGridfsBucket().openDownloadStream(file._id)
                readstream.pipe(res);
            } else {
                const answer: Res<null> = {
                    status: 0,
                    data: null,
                    error: "Not an image"
                }
                res.status(404).json(answer)
            }
        });
    } catch (err: any) {
        const answer: Res<null> = {
            status: 0,
            data: null,
            error: err ? err.toString() : ""
        }
        res.status(500).json(answer)
        logsEvent_controller.logs({
            message: "Get avatar route fail",
            error: err ? err.toString() : ""
        })
    }
})
router.delete("/getavatar/:id", async (req, res) => {
    try {
        const id = req.params.id
        await db.getGridfsBucket().delete(new mongoose.Types.ObjectId(id))
        let user = await user_controller.findUserById(req.userId)
        if (user.url_avatar === id) {
            user.url_avatar = ""
        }
        user.images = user.images.filter(i => i !== id)
        await user.save()
        const answer: Res<AnswerDeleteAvatar> = {
            status: 1,
            error: null,
            data: {
                deleteId: id
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
            message: "Remove avatar route fail",
            error: err ? err.toString() : ""
        })
    }
})
export default router