import React, { createContext } from 'react';
import { useRequest, RequestType } from '../hooks/useRequest';

type Props = {
    children: JSX.Element | JSX.Element[]
}
interface RequestContextInterface extends RequestType {

}
export const RequestContext = createContext<RequestContextInterface>({} as RequestContextInterface);
export const RequestProvider: React.FC<Props> = ({ children }) => {
    const request = useRequest()
    return (
        <RequestContext.Provider
            value={{ ...request }}
        >{children}
        </RequestContext.Provider>
    )
}