import { useMutation, useQueryClient } from "react-query";
import { AxiosRequest } from "./axiosInterceptor";
import { AxiosError, AxiosResponse } from "axios";

const qc = useQueryClient()
const acceptRequest = (data: { connectionId: string; }) => {
    return AxiosRequest({
        url: "connection/send-request",
        method: "post",
        data,
        withCredentials: true,
    });
};

export const acceptRequestMutation: any = () => {
    return useMutation(acceptRequest, {
        onSuccess: async (response: AxiosResponse) => {
            qc.invalidateQueries({ queryKey: ['allUsers', 'receivedRequests', 'receivedRequests'] })
            console.log(response.data.data);
        },
        onError(error: AxiosError) {
            return JSON.parse(error.message);
        },
    });
};