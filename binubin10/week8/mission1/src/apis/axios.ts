import axios, { type InternalAxiosRequestConfig } from 'axios';
import { LOCAL_STORAGE_KEY } from '../constants/key';

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL || 'http://localhost:8000',
});

// [요청 인터셉터]
axiosInstance.interceptors.request.use(
  (config) => {
    const rawAccessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    if (rawAccessToken) {
      const accessToken = rawAccessToken.replace(/^"|"$/g, '');
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log('요청 헤더 주입 성공:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// [응답 인터셉터]
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;

    // 401 에러가 났고, 재시도한 적이 없을 때
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 이미 refresh 요청이었는데 또 401이 난 거라면 무한 루프 방지를 위해 로그아웃
      if (originalRequest.url?.includes('/v1/auth/refresh')) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          const rawToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);

          if (!rawToken) {
            throw new Error('리프레시 토큰 없음');
          }

          const refreshToken = rawToken.replace(/^"|"$/g, '');

          const response = await axios({
            method: 'post',
            url: `${axiosInstance.defaults.baseURL}/v1/auth/refresh`,
            data: { refresh: refreshToken },
          });

          // 서버 응답 구조에 맞춰 토큰 추출
          const newAccessToken =
            response.data?.data?.accessToken || response.data?.accessToken;
          const newRefreshToken =
            response.data?.data?.refreshToken || response.data?.refreshToken;

          if (!newAccessToken) throw new Error('토큰 추출 실패');

          localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem(
              LOCAL_STORAGE_KEY.refreshToken,
              newRefreshToken,
            );
          }

          return newAccessToken;
        })().finally(() => {
          refreshPromise = null;
        });
      }

      return refreshPromise.then((token) => {
        const cleanToken = token.replace(/^"|"$/g, '');
        originalRequest.headers.Authorization = `Bearer ${cleanToken}`;
        return axiosInstance(originalRequest);
      });
    }
    return Promise.reject(error);
  },
);
