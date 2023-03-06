import { Router } from 'express'
import mongoose from 'mongoose';
import { Res, FileInfo } from '../interface/def_if'
import { user_controller, marker_controller, logsEvent_controller, db } from '../db/db'
import { NewMarkerData } from '../schema/markers';
import { upload } from "../handlers/gridFSStorage"
import { auth, checkUser } from '../handlers/middleware';
const router = Router()


router.post('/create', auth, upload.array('file'), async (req, res) => {
    try {
        if (!req.files) {
            res.status(500).json({ error: "Be absent file" })
            return
        }
        const files = req.files as FileInfo[]

        const dataJson = JSON.parse(req.body.text) as NewMarkerData
        dataJson.images = dataJson.images.map((i, index) => ({
            ...i,
            id: files[index].id?.toString() || "",
            url: files[index].id?.toString() || ""
        }))
        dataJson.owner = req.userId || ""
        const newMarker = await marker_controller.createMarker(dataJson)
        res.status(201).json({ newMarkerId: newMarker._id })

    } catch (err: any) {
        res.status(500).json({ error: err.toString() })
        logsEvent_controller.logs({
            message: "Create marker fail",
            error: err ? err.toString() : ""
        })
    }
});

router.get("/pictures/:id", async (req, res) => {
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
                res.status(404).json({ error: "Not an image" })
            }
        });
    } catch (err: any) {
        res.status(500).json({ error: err.toString() })
        logsEvent_controller.logs({
            message: "Get marker picture route fail",
            error: err ? err.toString() : ""
        })
    }
})
// router.get("/owner-avatar/:id", async (req, res) => {
//     try {
//         const id = new mongoose.Types.ObjectId(req.params.id);
//         db.getGfs().files.findOne({ _id: id, metadata: { ondelete: false } }, (err, file) => {
//             if (!file || file.length === 0) {
//                 return res.status(404).json({
//                     err: 'No file exists'
//                 });
//             }
//             if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/jpg') {
//                 // Read output to browser
//                 const readstream = db.getGridfsBucket().openDownloadStream(file._id)
//                 readstream.pipe(res);
//             } else {
//                 res.status(404).json({ error: "Not an image" })
//             }
//         });
//     } catch (err: any) {
//         res.status(500).json({ error: err.toString() })
//         logsEvent_controller.logs({
//             message: "Get marker picture route fail",
//             error: err ? err.toString() : ""
//         })
//     }
// })

router.get('/info-marker/:id', async (req, res) => {
    try {
        const userId = checkUser(req)
        const markerInfo = await marker_controller.markersInfoDetail(req.params.id)
        if (!markerInfo) {
            return res.status(404).json({ error: "Not found" })
        }
        if (markerInfo.privat && userId !== markerInfo.owner) {
            const data: NewMarkerData = {
                owner: markerInfo.owner,
                title: "",
                description: "",
                images: [],
                privat: markerInfo.privat,
                position: { lat: 0, lng: 0 }
            }
            res.json(data)
        }
        const data: NewMarkerData = {
            owner: markerInfo.owner,
            title: markerInfo.title,
            description: markerInfo.description,
            images: markerInfo.images,
            privat: markerInfo.privat,
            position: markerInfo.position
        }
        res.json(data)
    } catch (err: any) {
        res.status(500).json({ error: err.toString() })
        logsEvent_controller.logs({
            message: "Create marker fail",
            error: err ? err.toString() : ""
        })
    }
});

export default router