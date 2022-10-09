import _, { Request, Response, Application, Express } from 'express';
import { Server as ServerIO } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '../interface/socket_if'

declare global {
    namespace Express {
        interface Request {
            io: ServerIO<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
            userId?: string
        }
    }
}