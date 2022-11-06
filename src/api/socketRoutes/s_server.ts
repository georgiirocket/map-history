import ServerHTTP from "http"
import fs from 'fs'
import path from 'path'
import config from "config"
import { Server as ServerIO } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "../../interface/def_if"
import { db } from "../../db/db"
import { authSocket } from "../../handlers/middleware"

const corsOrigin = config.get("cors_socket_origin") as string[]

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