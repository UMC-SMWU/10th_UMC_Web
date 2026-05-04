import axios from 'axios';
import { LOCAL_STORAGE_KEY } from '../constants/key';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  let token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

  if (token) {
    // 만약 토큰에 따옴표가 포함되어 있다면 제거합니다.
    token = token.replace(/^"(.*)"$/, '$1');
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log('실제로 전송되는 헤더:', config.headers.Authorization);
  return config;
});
