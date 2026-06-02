import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { postLogout, postSignin } from "../apis/auth";
import type { RequestSigninDto } from "../types/auth";

type AuthContextType = {
  accessToken: string | null;
  login: (values: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessToken,
    setItem: setAccessTokenStorage,
    removeItem: removeAccessToken,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const { setItem: setRefreshTokenStorage, removeItem: removeRefreshToken } =
    useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessToken(),
  );

  const clearAuth = () => {
    removeAccessToken();
    removeRefreshToken();
    setAccessToken(null);
  };

  const login = async (values: RequestSigninDto) => {
    const response = await postSignin(values);

    setAccessTokenStorage(response.data.accessToken);
    setRefreshTokenStorage(response.data.refreshToken);
    setAccessToken(response.data.accessToken);
  };

  const logout = async () => {
    try {
      await postLogout();
    } finally {
      clearAuth();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        login,
        logout,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서 사용해야 합니다.");
  }

  return context;
};
