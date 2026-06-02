import { useEffect } from "react";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

const GoogleLoginRedirectPage = () => {

  const {setItem : setAccessToken} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const {setItem : setRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(window.location.search, urlParams) 
    const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
    const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);

    if(accessToken) { // 로그인 성공
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      window.location.replace('/my'); 
    }
}, [setAccessToken, setRefreshToken]) 
  return (
    <div>
      구글 로그인 리다이렉 확인
    </div>
  )
}
export default GoogleLoginRedirectPage;