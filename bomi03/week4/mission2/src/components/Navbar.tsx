import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import useLogout from "../hooks/mutations/useLogout";

type NavbarProps = {
  onClickMenu?: () => void;
};

const Navbar = ({ onClickMenu }: NavbarProps) => {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();

  const { data } = useGetMyInfo(accessToken);
  const logoutMutation = useLogout(logout);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  const handleClickLogin = () => {
    sessionStorage.removeItem("redirectAfterLogin");
  };

  return (
    <nav className="fixed z-10 w-full bg-white shadow-md dark:bg-gray-900">
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
            className="text-gray-700 hover:text-blue-500 dark:text-gray-300"
          >
            검색
          </Link>

          {!accessToken && (
            <>
              <Link
                to="/login"
                onClick={handleClickLogin}
                className="text-gray-700 hover:text-blue-500 dark:text-gray-300"
              >
                로그인
              </Link>

              <Link
                to="/signup"
                className="text-gray-700 hover:text-blue-500 dark:text-gray-300"
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
                disabled={logoutMutation.isPending}
                className="text-gray-700 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-300"
              >
                {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
