import axios, { AxiosError, AxiosResponse } from "axios";

const url: string = "http://localhost:4000/";
const client = axios.create({ baseURL: url });

export const AxiosRequest = ({ ...options }) => {
  const token = localStorage.getItem("token");



  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` :'',
  };

  const onSuccess = (response: AxiosResponse) => {
    return response;
  };

  const onError = (error: AxiosError) => {
    const message = error.response?.data;
    throw new Error(JSON.stringify(message));
  };

  return client({ ...options, headers }).then(onSuccess).catch(onError);
};