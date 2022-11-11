import multer from 'multer'
import { GridFsStorage } from "multer-gridfs-storage"
import { FileInfo } from "../interface/def_if"

const URL: string = process.env.MONGO_URL || ""

const storage = new GridFsStorage({
    url: URL,
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