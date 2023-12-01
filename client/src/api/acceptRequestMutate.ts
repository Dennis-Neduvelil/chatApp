import { useMutation } from "react-query";
import { AxiosRequest } from "./axiosInterceptor";
import { AxiosError, AxiosResponse } from "axios";

const acceptRequest = (data: { connectionId: string; }) => {
    return AxiosRequest({
        url: "connections/accept-request",
        method: "post",
        data,
        withCredentials: true,
    });
};

export const AcceptRequestMutation: any = () => {
   
    return useMutation(acceptRequest, {
        onSuccess: async (response: AxiosResponse) => {
            console.log(response.data.data);
        },
        onError(error: AxiosError) {
            return JSON.parse(error.message);
        },
    });
};