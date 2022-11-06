import { Types } from 'mongoose'
export interface Res<T> {
    status: 0 | 1,
    data: T,
    error: null | string
}
export interface ServerToClientEvents {
    updateToken: () => void;
}

export interface ClientToServerEvents {
    hello: (p: string) => void;
}

export interface InterServerEvents {

}
export interface SocketData {
    userId: string
}

export interface Metadata {
    ondelete: boolean;
}
export interface FileInfo {
    fieldname?: string;
    originalname?: string;
    encoding?: string;
    mimetype?: string;
    id?: Types.ObjectId;
    filename: string;
    metadata: Metadata;
    bucketName: string;
    chunkSize?: number;
    size?: number;
    uploadDate?: Date;
    contentType?: string;
}