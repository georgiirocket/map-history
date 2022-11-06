import _, { Request, Response, Application, Express } from 'express';
import { Server as ServerIO, Socket } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '../interface/def_if'

declare global {
    namespace Express {
        interface Request {
            io: ServerIO<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
            userId?: string
        }
    }
}