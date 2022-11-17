import React, { useEffect } from 'react';
import { socket } from "../socket.io/socketInit"

import { useAppSelector } from '../hooks/useRedux'

type Props = {
    children: JSX.Element | JSX.Element[]
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
    const { isAuth } = useAppSelector(state => state.global)
    useEffect(() => {
        isAuth ? socket.connect() : socket.disconnect()
    }, [isAuth])
    useEffect(() => {
        socket.on("connect_error", (err) => {
            console.error(`connect_error due to ${err}`);
        });
        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);
    return (<>{children}</>)
}