import mongoose from 'mongoose';
import config from "config"
import Grid from "gridfs-stream"
import { ILogs, logs, IEvent, event } from "../schema/schema"
import { IUser, users } from "../schema/user"

const URL: string = config.get("mongo_url")

class db_connect {
    #mapDB: mongoose.Connection
    #gfs: null | Grid.Grid
    users_model: mongoose.Model<IUser>
    logs_model: mongoose.Model<ILogs>
    event_model: mongoose.Model<IEvent>

    constructor() {
        this.#mapDB = mongoose.createConnection(URL)
        this.users_model = this.#mapDB.model<IUser>("users", users)
        this.logs_model = this.#mapDB.model<ILogs>("logs", logs)
        this.event_model = this.#mapDB.model<IEvent>("events", event)
        this.#gfs = null
    }

    mapdb_init(): void {
        console.log("Map db is initialized")
        this.#mapDB.once("open", () => {
            this.#gfs = Grid(this.#mapDB.db, mongoose.mongo);
        })
    }

    gfs(callback: <T>(g: Grid.Grid) => T): void {
        if (!this.#gfs) {
            return
        }
        callback(this.#gfs)
    }
}
export const db = new db_connect()
