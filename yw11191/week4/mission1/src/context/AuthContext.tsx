import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  handleLoginSuccess: (accessToken: string, refreshToken: string) => void;
  handleLogoutSuccess: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  handleLoginSuccess: () => {},
  handleLogoutSuccess: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage(), 
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage(), 
  );

  // useMutation 성공 시 토큰 상태를 동기화할 순수 컨텍스트 함수들
  const handleLoginSuccess = (newAccessToken: string, newRefreshToken: string) => {
    setAccessTokenInStorage(newAccessToken);
    setRefreshTokenInStorage(newRefreshToken);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
  };

  const handleLogoutSuccess = () => {
    removeAccessTokenFromStorage();
    removeRefreshTokenFromStorage();
    setAccessToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, handleLoginSuccess, handleLogoutSuccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.");
  }

  return context;
};