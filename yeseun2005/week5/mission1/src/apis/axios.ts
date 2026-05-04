import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    if (accessToken) {
        const token = JSON.parse(accessToken); // JSON.parse로 따옴표 제거
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});