import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";

type NavbarProps = {
  onClickMenu?: () => void;
};

const Navbar = ({ onClickMenu }: NavbarProps) => {
  const { accessToken, logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      if (!accessToken) {
        setData(null);
        return;
      }

      const response = await getMyInfo();
      setData(response);
    };

    getData();
  }, [accessToken]);

  const handleLogout = async () => {
    await logout();
    setData(null);
    navigate("/");
  };

  const handleClickLogin = () => {
    sessionStorage.removeItem("redirectAfterLogin");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onClickMenu}
            className="text-gray-900 dark:text-white"
            aria-label="사이드바 열기"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                d="M7.95 11.95h32m-32 12h32m-32 12h32"
              />
            </svg>
          </button>

          <Link
            to="/"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            SpinningSpinning Dolimpan
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/search"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            검색
          </Link>

          {!accessToken && (
            <>
              <Link
                to="/login"
                onClick={handleClickLogin}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                로그인
              </Link>

              <Link
                to="/signup"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                회원가입
              </Link>
            </>
          )}

          {accessToken && (
            <>
              <span className="text-gray-700 dark:text-gray-300">
                {data?.data?.name ?? "사용자"}님 반갑습니다.
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
