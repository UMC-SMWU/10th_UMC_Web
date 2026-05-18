import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const GoogleLoginRedirectPage = () => {
  const { setItem: setAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken,
  );

  const { setItem: setRefreshToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.refreshToken,
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
    const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);

    console.log("구글 로그인 리다이렉트 페이지 실행");
    console.log("accessToken:", accessToken);
    console.log("refreshToken:", refreshToken);

    if (!accessToken) {
      window.location.replace("/login");
      return;
    }

    setAccessToken(accessToken);

    if (refreshToken) {
      setRefreshToken(refreshToken);
    }

    sessionStorage.removeItem("redirectAfterLogin");

    window.location.replace("/");
  }, [setAccessToken, setRefreshToken]);

  return <div>구글 로그인 리다이렉트 화면</div>;
};

export default GoogleLoginRedirectPage;
