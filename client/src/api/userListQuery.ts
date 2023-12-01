import { useQuery } from "react-query"
import { AxiosRequest } from "./axiosInterceptor"


const allUsers = () => {
    return AxiosRequest({
        url: "connections/all",
        method: "get",
        withCredentials: true
    })
}

export const AllUsersQuery = () => {
    return useQuery('allUsers', allUsers, { enabled: false })
}