import mongoose from 'mongoose';
import config from "config"
import { ILogs, logs, IEvent, event } from "../schema/schema"
import { IUser, users } from "../schema/user"

const URL: string = config.get("mongo_url")

class db_connect {
    #mapDB: mongoose.Connection
    users_model: mongoose.Model<IUser>
    logs_model: mongoose.Model<ILogs>
    event_model: mongoose.Model<IEvent>

    constructor() {
        this.#mapDB = mongoose.createConnection(URL)
        this.users_model = this.#mapDB.model<IUser>("users", users)
        this.logs_model = this.#mapDB.model<ILogs>("logs", logs)
        this.event_model = this.#mapDB.model<IEvent>("events", event)
    }

    mapdb_init(): void {
        console.log("Map db is initialized")
    }
}
export const db = new db_connect()
