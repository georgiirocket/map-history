import { Schema, Types, Document } from 'mongoose'

export interface IMarkerImage {
    id: string,
    active: boolean,
    url: string
}

export interface IMarkerPosition {
    lat: number,
    lng: number
}

export interface Imarker extends Document {
    _id: Types.ObjectId,
    owner: string,
    privat: boolean,
    title: string,
    description: string,
    position: IMarkerPosition
    images: IMarkerImage[]
    ondelete: boolean
    dateCreate: Date
}
export interface NewMarkerData {
    owner: string,
    privat: boolean,
    title: string,
    description: string,
    position: IMarkerPosition
    images: IMarkerImage[]
}

export const marker = new Schema<Imarker>({
    owner: { type: String, default: "" },
    privat: { type: Boolean, default: false },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    images: { type: [], default: [] },
    position: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 }
    },
    ondelete: { type: Boolean, default: false },
    dateCreate: { type: Date, default: Date.now }
})