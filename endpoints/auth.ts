import { axiosInstance } from "@/config/api";

export const authenticateUser = async (body: Object) => {
    const { data } = await axiosInstance.post('auth/signin', body);
    return data;
}

export const changePassword = async (body: Object) => {
    const { data } = await axiosInstance.post('auth/change_password', body);
    return data;
}

export const createUser = async (body: Object) => {
    const { data } = await axiosInstance.post('auth/signup', body);
    return data;
}

export const requestResetPassword = async (body: Object) => {
    const { data } = await axiosInstance.post('auth/request_reset_password', body);
    return data;
}

export const resetPassword = async (body: Object) => {
    const { data } = await axiosInstance.post('auth/reset_password', body);
    return data;
}