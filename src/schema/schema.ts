import { Schema, Types, Document } from 'mongoose'
export interface ILogs extends Document {
    _id: Types.ObjectId
    message: string
    error: string
    dateCreate: Date
}
export interface IEvent extends Document {
    _id: Types.ObjectId
    nameEvent: string
    message: string
    dateCreate: Date
}

export const logs = new Schema<ILogs>({
    message: { type: String, default: "" },
    error: { type: String, default: "" },
    dateCreate: { type: Date, default: Date.now }
})
export const event = new Schema<IEvent>({
    nameEvent: { type: String, default: "" },
    message: { type: String, default: "" },
    dateCreate: { type: Date, default: Date.now }
})