import axios from "axios";
import { DEBUG } from "./feature-flags";
import { deleteCookie, getCookie } from "cookies-next";
import { redirect } from "next/navigation";

const PRODAPIURL = 'https://openapp.up.railway.app/api/v1/';
const TESTAPIURL = 'http://localhost:8000/api/v1/'

const APIURL = true ? TESTAPIURL : PRODAPIURL


const getToken = () => {
    const token = getCookie("token");
    return token ? `Bearer ${token}` : '';
};

const axiosInstance = axios.create({
    baseURL: APIURL,
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
            redirect("/auth/login")
        }
        return Promise.reject(error);
    }
);

export { axiosInstance };
