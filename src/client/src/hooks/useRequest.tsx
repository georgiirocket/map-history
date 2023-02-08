import { useNavigate } from "react-router-dom"
import { config } from "../config/default";
import {
    useCheckTokenStartAppQuery,
    useLazyExitQuery,
    useCheckReadyAppQuery
} from "../redux_toolkit/api/api";

export interface RequestType {
    exit: () => void
}

export const useRequest = () => {
    let navigate = useNavigate()
    const [getExit] = useLazyExitQuery()
    useCheckTokenStartAppQuery()
    useCheckReadyAppQuery()

    const request: RequestType = {
        exit: () => getExit().unwrap().then(() => navigate(config.routes.map)),
    }
    return request
}







