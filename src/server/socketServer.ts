import ServerHTTP from "http"
import { Server as ServerIO } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "../interface/def_if"
import { authSocketAll } from "../handlers/middleware"
import { socketStorage } from "../storage/socketStorage"

const corsOrigin = (() => {
    if (process.env.CORS_SOCKET_ORIGIN) {
        return process.env.CORS_SOCKET_ORIGIN.split(" ").map(i => i.trim()).filter(i => i)
    }
    return ([])
})()

export const create_socket_server = (server: ServerHTTP.Server): ServerIO<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> => {
    const io = new ServerIO<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
        cors: {
            origin: corsOrigin,
            methods: ["GET", "POST"]
        },
        maxHttpBufferSize: 1e8
    })
    io.use(authSocketAll);
    io.on('connection', (socket) => {
        socketStorage.addSocket({
            socketId: socket.id,
            userId: socket.data.userId || ""
        })
        socket.on("hello", (p) => {
            console.log("hello", p)
        })
        socket.on("disconnect", () => {
            socketStorage.removeSocket(socket.id)
        })
    })
    return io
}