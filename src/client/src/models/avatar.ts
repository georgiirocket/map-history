export interface AvatarModel {
    id: string,
    url: string,
    active: boolean
}

export interface MarkerPhotoModel extends AvatarModel {
    file: File,
    activeScreen: boolean
}