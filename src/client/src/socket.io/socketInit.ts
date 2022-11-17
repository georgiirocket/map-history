import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../interface/interface_default"

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
    autoConnect: false,
    withCredentials: true,
    reconnection: true,
});