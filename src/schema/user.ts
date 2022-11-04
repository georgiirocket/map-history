import { Schema, Types } from 'mongoose'
export interface IUser {
    _id: Types.ObjectId
    nickname: string
    avatar: boolean
    url_avatar: string
    login: string
    password: string
    specialpermit: string[]
    supreRoot: boolean
    role: string[]
    email: string
    socket: string[]
    settings: string[]
    mypoint: string[]
    myFavofitePoint: string[]
    mygrops: string[]
    ondelete: boolean
    active: boolean
    dateCreate: Date
}
export const users = new Schema<IUser>({
    nickname: { type: String, default: "" },
    avatar: { type: Boolean, default: false },
    url_avatar: { type: String, default: "" },
    login: { type: String, default: "" },
    password: { type: String, default: "" },
    specialpermit: { type: [String], default: [] },
    supreRoot: { type: Boolean, default: false },
    role: { type: [String], default: ['user'] },
    email: { type: String, default: "" },
    socket: { type: [String], default: [] },
    settings: { type: [String], default: [] },
    mypoint: { type: [String], default: [] },
    myFavofitePoint: { type: [String], default: [] },
    mygrops: { type: [String], default: [] },
    ondelete: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    dateCreate: { type: Date, default: Date.now }
})