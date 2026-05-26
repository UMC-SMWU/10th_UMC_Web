import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import useGetMyInfo from "../hooks/queries/useGetMyInfo.ts";

const Navbar = () => {
  const { accessToken, logout } = useAuth();

  const navigate = useNavigate();

  const { data } = useGetMyInfo();

  const nickname = data?.data?.name;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-20 flex h-20 items-center justify-between border-b border-gray-800 bg-black px-6 text-white">
      <div className="flex items-center gap-4">
        <button className="text-3xl md:hidden">☰</button>

        <Link to="/" className="text-2xl font-bold text-pink-500">
          돌려돌려 LP판
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <Link to="/search" className="hover:text-pink-400">
          🔍
        </Link>

        {!accessToken ? (
          <>
            <Link to="/login" className="hover:text-pink-400">
              로그인
            </Link>

            <Link
              to="/signup"
              className="rounded bg-pink-500 px-4 py-2 hover:bg-pink-600"
            >
              회원가입
            </Link>
          </>
        ) : (
          <>
            <span>
              {nickname
                ? `${nickname}님 반갑습니다.`
                : "반갑습니다."}
            </span>

            <Link to="/my" className="hover:text-pink-400">
              마이페이지
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded bg-gray-700 px-4 py-2 hover:bg-gray-600"
            >
              로그아웃
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;