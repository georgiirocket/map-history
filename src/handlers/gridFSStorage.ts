import multer from 'multer'
import { GridFsStorage } from "multer-gridfs-storage"
import { FileInfo } from "../interface/def_if"
import { db } from '../db/db'

const storage = new GridFsStorage({
    db: db._mapDB,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.originalname;
            const fileInfo: FileInfo = {
                filename: filename,
                bucketName: 'uploads',
                metadata: {
                    ondelete: false
                }
            };
            resolve(fileInfo);
        });
    }
});

export const upload = multer({ storage })