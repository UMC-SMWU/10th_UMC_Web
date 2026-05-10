/*import axios, { type AxiosInstance } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const axiosInstance : AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  headers :{
    Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)}`, // 로컬의 토큰 
  }
})*/

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; // 요청이 이미 재시도되었는지 여부를 추적하는 플래그 - 401 에러 발생 시 토큰 재발급 후 원래 요청을 한 번만 재시도하도록 하기 위해 사용

}

// 전역 변수로 refresh 요청의 Promise를 저장해서 중복 요청을 방지
let refreshPromise: Promise<string> | null = null;


export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 인터셉터: 모든 요청 전에 accessTokem을 Authorization 헤더에 추가
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage // localStorage에서 accesstoken을 가져옴.
    .getItem(LOCAL_STORAGE_KEY.accessToken)
    ?.replaceAll('"', '');

  // 토큰이 존재 시 Authorization 헤더에 Bearer 토큰으로 추가
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config; // 수정된 요청 설정을 반환.
}, (error) => Promise.reject(error)); // 요청 인터셉터가 실패하면, 에러 뿜음.


// 응답 인터셉터: 401 Unauthorized 에러가 발생하면 refresh 토큰으로 access 토큰 재발급 시도
axiosInstance.interceptors.response.use(
  (response) => response, // 응답이 성공적이면 그대로 반환
  async (error) => {
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;

    // 401 에러이면서, 아직 재시도되지 않은 요청인 경우에만 토큰 재발급 시도
    if(error.response && error.response.status === 401 && !originalRequest._retry){
      // refresh 엔드포인트 401 에러가 발생한 경우(Unauthorized), 중복 재시도 방지를 위해 로그아웃 처리.
      if(originalRequest.url==='/v1/auth/refresh'){
        const {removeItem:removeAccessToken} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
        const {removeItem:removeRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
        removeAccessToken();
        removeRefreshToken(); // 토큰 제거
        window.location.replace('/login'); // 로그인 페이지로 이동
        return Promise.reject(error);
      }

      //재시도 플래그 설정
      originalRequest._retry = true;


      // 이미 리프래시 요청이 진행중이면, 그 promise를 재사용함.
      if(!refreshPromise){
        // refresh 요청 실행 후, 프로미스를 전역 변수에 할당
        refreshPromise = (async() => {
          const {getItem:getRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
          const refreshToken = getRefreshToken()?.replaceAll('"', ''); // localStorage에서 refreshToken을 가져옴
          const {data} = await axiosInstance.post('/v1/auth/refresh', {
            refresh:refreshToken
          });
          // 새 토큰이 반환
          const {setItem:setAccessToken} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
          const {setItem:setRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

          setAccessToken(data.data.accessToken); // localStorage에 새 accessToken 저장
          setRefreshToken(data.data.refreshToken); // localStorage에 새 refreshToken 저장

          return data.data.accessToken; // 새 accessToken 반환하여 다른 요청들이 이것을 사용할 수 있게함.
        })() //즉시 실행 함수.
          .catch((error) => {
            const {removeItem:removeAccessToken} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
            const {removeItem:removeRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
            removeAccessToken();
            removeRefreshToken();
          })
          .finally(() => {
            refreshPromise = null;
          });
      }


      // 진행 중인 refreshPromise가 해결될 때까지 기다림.
      return refreshPromise.then((newAccessToken: string) => {
        // 원본 요청의 Authorization 헤더를 갱신된 토큰으로 업데이트
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        // 업데이트 된 원본 요청을 재시도 함. 
        return axiosInstance.request(originalRequest);
      });
    }
    // 401 에러가 아닌경우에 그대로 오류를 반환
    return Promise.reject(error);
  }
);