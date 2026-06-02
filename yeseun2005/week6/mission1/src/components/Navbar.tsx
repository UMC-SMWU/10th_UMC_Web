import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import useGetMyInfo from "../hooks/queries/UseGetMyInfo.ts";
const Navbar = () => {
    const { accessToken } = useAuth();

    const { data } = useGetMyInfo();

    const nickname = data?.data?.name;

    return (
        <nav className="fixed top-0 left-0 right-0 h-20 bg-black text-white z-20 flex items-center justify-between px-6 border-b border-gray-800">
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
                            className="bg-pink-500 px-4 py-2 rounded hover:bg-pink-600"
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
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;