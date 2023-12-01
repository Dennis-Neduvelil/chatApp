import { useQuery } from "react-query"
import { AxiosRequest } from "./axiosInterceptor"


const sendRequests = () => {
    return AxiosRequest({
        url: "connections/requests-sended",
        method: "get",
        withCredentials: true
    })
}

export const SendRequestsQuery = () => {
    return useQuery('sendRequests', sendRequests, { enabled: false })
}