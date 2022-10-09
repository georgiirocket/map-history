import React, { createContext, useEffect } from 'react';
import { useRequest, RequestType } from '../hooks/useRequest';

type Props = {
    children: JSX.Element | JSX.Element[]
}
interface RequestContextInterface extends RequestType {

}
export const RequestContext = createContext<RequestContextInterface>({} as RequestContextInterface);
export const RequestProvider: React.FC<Props> = ({ children }) => {
    const request = useRequest()

    useEffect(() => {
        request.checkTokenStartApp()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <RequestContext.Provider
            value={{ ...request }}
        >{children}
        </RequestContext.Provider>
    )
}