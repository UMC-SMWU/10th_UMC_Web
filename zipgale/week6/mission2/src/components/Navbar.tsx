import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { accessToken } = useAuth();
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md-fixed w-full z-10">
      <div className="flex items-center justify-between p-4">
        <Link
          to="/"
          className="text-xl font-bold text-gray-800 dark:text-white"
        >
          돌려돌려돌림판
        </Link>
        <div className="space-x-6">
          {!accessToken && ( // accessToken이 없을 때만 로그인/회원가입 링크 표시
            <>
              <Link
                to={"/login"}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              >
                로그인
              </Link>
              <Link
                to={"/signup"}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              >
                회원 가입
              </Link>
            </>
          )}
          {accessToken && (
            <>
              <Link to={"/my"}>마이 페이지</Link>
              <Link
                to={"/search"}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              >
                검색
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
