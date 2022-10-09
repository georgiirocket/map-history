import React, { useEffect } from 'react';
import { io } from "socket.io-client";
// import { ServerToClientEvents, ClientToServerEvents } from "../interface/socket_int"

type Props = {
    children: JSX.Element | JSX.Element[]
}
const socket = io({
    withCredentials: true,
    reconnection: true,
});
export const SocketProvider: React.FC<Props> = ({ children }) => {
    // const sendPing = () => {
    //     setTimeout(() => {
    //         socket.emit('hello');
    //     }, 5000)

    // }
    // useEffect(() => {
    //     socket.on('connect', () => {
    //         console.log('connect')
    //     });

    //     socket.on('disconnect', () => {
    //         console.log('disconnect')
    //     });
    //     socket.on("connect_error", (err) => {
    //         console.log(`connect_error due to ${err}`);
    //     });
    //     sendPing()
    //     return () => {
    //         socket.off('connect');
    //         socket.off('disconnect');
    //     };

    // }, []);


    return (<>{children}</>)
}