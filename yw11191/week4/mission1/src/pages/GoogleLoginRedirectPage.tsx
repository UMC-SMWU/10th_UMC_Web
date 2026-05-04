import React, { useEffect } from 'react'
import { LOCAL_STORAGE_KEY } from '../constants/key';
import { set } from 'zod';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const GoogleLoginRedirectPage = () => {
    const {setItem: setAccessToken} = useLocalStorage(
        LOCAL_STORAGE_KEY.accessToken
    );
    const {setItem: setRefreshToken} = useLocalStorage(
        LOCAL_STORAGE_KEY.refreshToken
    );
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
        const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);

        if (accessToken) {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken || ''); // refreshToken이 없을 경우 빈 문자열로 저장
            window.location.href = "/mypage"; // 로그인 후 홈으로 리다이렉트
        }
    }, [setAccessToken, setRefreshToken]);
  return (
    <div>구글 로그인 리다이렉트 화면</div>
  )
}
