import { Schema, model, Types } from 'mongoose'
interface ILogs {
    _id: Types.ObjectId
    message: string
    error: string
    dateCreate: Date
}
interface IEvent {
    _id: Types.ObjectId
    nameEvent: string
    message: string
    dateCreate: Date
}

const logs = new Schema<ILogs>({
    message: { type: String, default: "" },
    error: { type: String, default: "" },
    dateCreate: { type: Date, default: Date.now }
})
const event = new Schema<IEvent>({
    nameEvent: { type: String, default: "" },
    message: { type: String, default: "" },
    dateCreate: { type: Date, default: Date.now }
})
export const LOGS = model<ILogs>("logs", logs)
export const EVENTS = model<IEvent>("events", event)