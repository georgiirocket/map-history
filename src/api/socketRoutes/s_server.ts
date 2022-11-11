import ServerHTTP from "http"
import { Server as ServerIO } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "../../interface/def_if"
import { authSocket } from "../../handlers/middleware"

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
    io.on('connection', (socket) => {
        socket.use((packet, next) => authSocket({
            socket: socket,
            packet: packet[0],
            next: next,
            authRoute: [
                "uploadProfileImage"
            ]
        }))
        socket.on("hello", (p) => {
            console.log("hello", p)
        })
    })
    return io
}