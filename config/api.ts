import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { redirect } from "next/navigation";
import { clearSessionStorage } from "@/hooks";
import { BASE_URL } from "./url";


const getToken = () => {
    const token = getCookie("token");
    return token ? `Bearer ${token}` : '';
};

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000
});

axiosInstance.interceptors.request.use(config => {
    if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
    } else {
        config.headers['Content-Type'] = 'application/json';
    }
    config.headers['Authorization'] = getToken();
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            deleteCookie("token")
            clearSessionStorage()
            redirect("/auth/login")
        }
        return Promise.reject(error);
    }
);

export { axiosInstance };
