import { useMutation } from "react-query";
import { AxiosRequest } from "./axiosInterceptor";
import { AxiosError, AxiosResponse } from "axios";

const signup = (data: { email: string; password: string, fullName: string }) => {
    return AxiosRequest({
        url: "auth/signup",
        method: "post",
        data,
        withCredentials: true,
    });
};

export const useSignUpMutation: any = () => {
    return useMutation(signup, {
        onSuccess: async (response: AxiosResponse) => {
            console.log(response.data.data);
        },
        onError(error: AxiosError) {
            return JSON.parse(error.message);
        },
    });
};