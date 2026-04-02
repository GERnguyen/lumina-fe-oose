import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import env from "../env";

export const ACCESS_TOKEN_KEY = env.accessToken;

const baseURL = env.apiUrl;

const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.dispatchEvent(new Event("auth:logout"));
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
