import { useQuery } from "react-query"
import { AxiosRequest } from "./axiosInterceptor"


const receivedRequests = () => {
    return AxiosRequest({
        url: "connections/requests-received",
        method: "get",
        withCredentials: true
    })
}

export const ReceivedRequestsQuery = () => {
    return useQuery('receivedRequests', receivedRequests, { enabled: false })
}