import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;
export const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
});

// 요청 인터셉터
axiosInstance.interceptors.request.use((config) => {
  const {getItem} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const accessToken = getItem();
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
},
(error) => {
  return Promise.reject(error);
}
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest:CustomInternalAxiosRequestConfig = error.config;

    // 토큰 만료로 인한 401 에러인 경우
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === "/v1/auth/refresh") {
        const {removeItem:removeAccessToken} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
        const {removeItem:removeRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
        removeAccessToken();
        removeRefreshToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // 재발급 시도
      originalRequest._retry = true;

      // 이미 재발급 요청이 진행 중인 경우
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const {getItem: getRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
          const refreshToken = getRefreshToken();

          const {data} = await axiosInstance.post("/v1/auth/refresh", {
            refresh: refreshToken,
          });
          // 새 토큰 반환
          const {setItem: setAccessToken} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
          const {setItem: setRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
          setAccessToken(data.data.accessToken);
          setRefreshToken(data.data.refreshToken);

          return data.data.accessToken;
        })().catch((error) => {
            const {removeItem:removeAccessToken} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
            const {removeItem:removeRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
            removeAccessToken();
            removeRefreshToken();
          }).finally(()=> {
            refreshPromise = null;
          });
      }
      // 재발급이 완료될 때까지 대기
      return refreshPromise.then((newAccessToken) => {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        // 원래 요청 재시도
        return axiosInstance(originalRequest);
      });
    }
    // 기타 에러인 경우
    return Promise.reject(error);
  },
);