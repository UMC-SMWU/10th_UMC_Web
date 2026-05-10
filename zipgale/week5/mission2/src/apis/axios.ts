/*import axios, { type AxiosInstance } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const axiosInstance : AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  headers :{
    Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)}`, // 로컬의 토큰 
  }
})*/

import axios, { type AxiosInstance } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage
    .getItem(LOCAL_STORAGE_KEY.accessToken)
    ?.replaceAll('"', '');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});