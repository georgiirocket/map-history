import { Schema, model, Types } from 'mongoose'
export interface IUser {
    _id: Types.ObjectId
    nickname: string
    avatar: boolean
    url_avatar: string
    login: string
    password: string
    specialpermit: string[]
    socket: string[]
    settings: string[]
    mypoint: string[]
    myFavofitePoint: string[]
    mygrops: string[]
    ondelete: boolean
    active: boolean
    dateCreate: Date
}
const users = new Schema<IUser>({
    nickname: { type: String, default: "" },
    avatar: { type: Boolean, default: false },
    url_avatar: { type: String, default: "" },
    login: { type: String, default: "" },
    password: { type: String, default: "" },
    specialpermit: { type: [String], default: [] },
    socket: { type: [String], default: [] },
    settings: { type: [String], default: [] },
    mypoint: { type: [String], default: [] },
    myFavofitePoint: { type: [String], default: [] },
    mygrops: { type: [String], default: [] },
    ondelete: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    dateCreate: { type: Date, default: Date.now }
})
export const USERS = model<IUser>("users", users)