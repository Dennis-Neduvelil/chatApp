import { useQuery } from "react-query"
import { AxiosRequest } from "./axiosInterceptor"


const getConnections = () => {
    return AxiosRequest({
        url: "connections/get-connections",
        method: "get",
        withCredentials: true
    })
}

export const GetConnectionsQuery = () => {
    return useQuery('getConnections', getConnections)
}