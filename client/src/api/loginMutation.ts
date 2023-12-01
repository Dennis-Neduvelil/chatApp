import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { AxiosRequest } from "./axiosInterceptor";
import { AxiosError, AxiosResponse } from "axios";
import useAuth from "../hooks/useAuthContext";

const login = (data: { email: string; password: string }) => {
    return AxiosRequest({
        url: "auth/signin",
        method: "post",
        data,
        withCredentials: true,
    });
};

export const useLoginMutation: any = () => {
    const { setUserId } = useAuth();
    const navigate = useNavigate();
    return useMutation(login, {
        onSuccess: async (response: AxiosResponse) => {
            console.log(response.data.data);
            let data = { accessToken: response.data.data.token, id: response.data.data.userId};
            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("userId", data.id);
            console.log("userId", data.id)
            setUserId(data.id);
            navigate('/')
        },
        onError(error: AxiosError) {
            return JSON.parse(error.message);
        },
    });
};