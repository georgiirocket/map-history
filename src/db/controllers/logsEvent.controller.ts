import { db_connect } from './db.controller'
import mongoose from 'mongoose';
import { ILogs, IEvent } from "../../schema/schema"
import { LogsData } from "../../interface/def_if"

const showLogs: string = process.env.SHOW_LOGS || ""

export class logsEvent_controller {
    #logs_model: mongoose.Model<ILogs>
    constructor(database: db_connect) {
        this.#logs_model = database.logs_model
    }

    async logs(data: LogsData) {
        try {
            const newLogs = new this.#logs_model({
                message: data.message,
                error: data.error
            })
            await newLogs.save()
            if (showLogs) {
                console.log("Message:", data.message)
                console.log("Error:", data.error)
            }
        } catch (err: any) {
            console.log(err ? err.toString() : "")
        }
    }
}