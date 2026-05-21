import axios, { type InternalAxiosRequestConfig } from 'axios';
import { LOCAL_STORAGE_KEY } from '../constants/key';

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
  // ✅ baseURL이 환경변수에서 잘 읽히는지 확인! 안되면 직접 주소를 써보세요.
  baseURL: import.meta.env.VITE_SERVER_API_URL || 'http://localhost:8000',
});

// [요청 인터셉터]
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      // 🔍 디버깅용 로그 (나중에 삭제하세요)
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
      // 이미 refresh 요청이었는데 401이 난 거라면 포기하고 로그인 페이지로
      if (originalRequest.url?.includes('/v1/auth/refresh')) {
        localStorage.clear(); // 싹 비우는 게 안전합니다.
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshToken = localStorage.getItem(
            LOCAL_STORAGE_KEY.refreshToken,
          );

          if (!refreshToken) {
            throw new Error('리프레시 토큰 없음');
          }

          // ✅ axiosInstance.post 대신 기본 axios를 쓰되 주소를 더 명확히 합니다.
          const response = await axios({
            method: 'post',
            url: `${axiosInstance.defaults.baseURL}/v1/auth/refresh`,
            data: { refresh: refreshToken },
          });

          // 서버 구조에 따라 data.data 혹은 data 확인
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
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest); // 재요청
      });
    }
    return Promise.reject(error);
  },
);
