import { MarkerPhotoModel } from "./avatar"
export interface CreateMarkerResponse {
    error: string,
    newMarkerId: string
}
export interface CreateMarkerRequest {
    owner: string,
    privat: boolean,
    title: string,
    description: string,
    position: {
        lat: number,
        lng: number
    }
    photos: MarkerPhotoModel[]
}