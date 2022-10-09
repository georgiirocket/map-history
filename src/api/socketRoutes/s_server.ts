import ServerHTTP from "http"
import config from "config"
import { Server as ServerIO } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "../../interface/socket_if"

const corsOrigin = config.get("cors_socket_origin") as string[]

export const create_socket_server = (server: ServerHTTP.Server): ServerIO<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> => {
    const io = new ServerIO<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
        cors: {
            origin: corsOrigin,
            methods: ["GET", "POST"]
        }
    })
    io.on('connection', (socket) => {
        console.log(socket.handshake.headers.cookie)
    })
    return io
}