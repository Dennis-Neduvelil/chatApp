import { useMutation, useQueryClient } from "react-query";
import { AxiosRequest } from "./axiosInterceptor";
import { AxiosError, AxiosResponse } from "axios";

const sendRequest = (data: { connectionId: string; }) => {
    return AxiosRequest({
        url: "connections/send-request",
        method: "post",
        data,
        withCredentials: true,
    });
};

export const SendRequestMutation: any = () => {
    const qc = useQueryClient();
    return useMutation(sendRequest, {
        onSuccess: async (response: AxiosResponse) => {
            qc.invalidateQueries({ queryKey: ['allUsers'] })
            console.log(response.data.data);
        },
        onError(error: AxiosError) {
            return JSON.parse(error.message);
        },
    });
};