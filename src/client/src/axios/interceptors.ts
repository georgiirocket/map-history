import axios from "axios"
import { toast } from 'react-toastify';
import { SR } from "../index"
import { config } from "../config/default"

interface ConfigRefreshToken {
    data: {
        refresh_token: string
    }
}
let notAuthOut: boolean = false
const instance = axios.create({});
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response) {
            if (error.response.status === 401 && notAuthOut) {
                toast.error("Not auth. Please, reload website", { autoClose: 2000 })
            }
            if (error.response.status === 401 && !notAuthOut) {
                notAuthOut = true
                let res = await instance.request<ConfigRefreshToken>({
                    url: config.apiConfig.rehreshToken,
                    method: "post",
                    data: {
                        refresh_token: SR.get()
                    }
                })
                if (res.statusText === "OK") {
                    notAuthOut = false
                }
                console.log(res)
                return res.statusText === "OK" ? instance(error.config) : error.response
            }

            return error.response
        }

        return Promise.reject(error);
    }
);
export default instance