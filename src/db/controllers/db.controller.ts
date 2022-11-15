import mongoose from 'mongoose';
import { ILogs, logs, IEvent, event } from "../../schema/schema"
import { IUser, users } from "../../schema/user"
import Grid from "gridfs-stream"

const URL: string = process.env.MONGO_URL || ""
const MONGO_USER: string = process.env.MONGO_USER || ""
const MONGO_PASSWORD: string = process.env.MONGO_PASSWORD || ""

export class db_connect {
    readonly _mapDB: mongoose.Connection
    #gfs: Grid.Grid
    #gridfsBucket: any
    users_model: mongoose.Model<IUser>
    logs_model: mongoose.Model<ILogs>
    event_model: mongoose.Model<IEvent>
    constructor() {
        this._mapDB = mongoose.createConnection(URL, {
            directConnection: true,
            retryWrites: true,
            w: "majority",
            auth: {
                username: MONGO_USER,
                password: MONGO_PASSWORD
            },
        })
        this.#gfs = {} as Grid.Grid
        this.#gridfsBucket = null
        this.users_model = this._mapDB.model<IUser>("users", users)
        this.logs_model = this._mapDB.model<ILogs>("logs", logs)
        this.event_model = this._mapDB.model<IEvent>("events", event)
    }
    mapdb_init(): void {
        console.log("Map db is initialized")
        this._mapDB.once('open', () => {
            this.#gridfsBucket = new mongoose.mongo.GridFSBucket(this._mapDB.db, {
                bucketName: 'uploads'
            });
            this.#gfs = Grid(this._mapDB.db, mongoose.mongo);
            this.#gfs.collection('uploads');
        });
    }
    getGridfsBucket(): any {
        return this.#gridfsBucket
    }
    getGfs(): Grid.Grid {
        return this.#gfs
    }
}