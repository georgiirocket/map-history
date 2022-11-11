import mongoose from 'mongoose';
import { ILogs, logs, IEvent, event } from "../schema/schema"
import { IUser, users } from "../schema/user"
import Grid from "gridfs-stream"

const URL: string = process.env.MONGO_URL || ""

class db_connect {
    #mapDB: mongoose.Connection
    gfs: Grid.Grid
    gridfsBucket: any
    users_model: mongoose.Model<IUser>
    logs_model: mongoose.Model<ILogs>
    event_model: mongoose.Model<IEvent>

    constructor() {
        this.#mapDB = mongoose.createConnection(URL)
        this.gfs = {} as Grid.Grid
        this.gridfsBucket = null
        this.users_model = this.#mapDB.model<IUser>("users", users)
        this.logs_model = this.#mapDB.model<ILogs>("logs", logs)
        this.event_model = this.#mapDB.model<IEvent>("events", event)
    }

    mapdb_init(): void {
        console.log("Map db is initialized")
        this.#mapDB.once('open', () => {
            this.gridfsBucket = new mongoose.mongo.GridFSBucket(this.#mapDB.db, {
                bucketName: 'uploads'
            });
            this.gfs = Grid(this.#mapDB.db, mongoose.mongo);
            this.gfs.collection('uploads');
        });
    }
}
export const db = new db_connect()
