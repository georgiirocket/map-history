import multer from 'multer'
import config from "config"
import { GridFsStorage } from "multer-gridfs-storage"
import { FileInfo } from "../interface/def_if"

const URL: string = config.get("mongo_url")

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