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
}
