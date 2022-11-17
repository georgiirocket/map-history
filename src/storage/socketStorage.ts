import { SocketStorage } from "../interface/def_if"

export class socket_storage {
    #socketStorage: SocketStorage[]
    constructor() {
        this.#socketStorage = []
    }
    init(): void {
        console.log("Socket storage is initialized")
    }
    addSocket(data: SocketStorage): SocketStorage {
        this.#socketStorage.push(data)
        return data
    }
    removeSocket(socketId: string): SocketStorage | null {
        const s = this.#socketStorage.find(i => i.socketId === socketId)
        this.#socketStorage = this.#socketStorage.filter(s => s.socketId !== socketId)
        return s || null
    }
}
export const socketStorage = new socket_storage()