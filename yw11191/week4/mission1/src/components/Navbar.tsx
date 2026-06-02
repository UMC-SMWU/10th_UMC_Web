import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { postLogout } from "../apis/auth";
import { useMutation } from "@tanstack/react-query";
import { MenuIcon } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { accessToken, handleLoginSuccess, handleLogoutSuccess } = useAuth();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      handleLogoutSuccess(); // 컨텍스트의 로컬 토큰 상태 클리어
      alert("로그아웃 성공");
      navigate("/login"); // 로그아웃 성공 시 로그인 페이지로 이동 처리
    },
    onError: (error) => {
      console.error("로그아웃 실패", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  });

  return <nav className="bg-neutral-900 shadow-md fixed w-full z-50">
    <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
            <button 
            onClick={onMenuClick}
            className="block text-gray-400 hover:text-white cursor-pointer transition-colors"
            aria-label="메뉴 토글"
          >
            <MenuIcon />
          </button>
          <Link to='/'
            className="text-xl font-bold text-white">
            SpinningSpinning Dolimpan
            </Link>
        </div>
        
        {!accessToken && (
            <>
            <div className="space-x-6">
                <Link to={"/login"} className="text-gray-300 hover:text-blue-500">
                    로그인
                </Link>
                <Link to={"/signup"} className="text-gray-300 hover:text-blue-500">
                    회원가입
                </Link>
            </div>
            </>
        )}
        {accessToken && (
            <>
            <div className="space-x-6">
                <Link to={"/search"} className="text-gray-300 hover:text-blue-500">
                    검색
                </Link>
                <button 
                onClick={() => logoutMutation.mutate()} // mutation 트리거 실행
                disabled={logoutMutation.isPending}
                className="text-gray-300 hover:text-rose-500 transition-colors cursor-pointer disabled:text-gray-600"
                >
                {logoutMutation.isPending ? "로딩..." : "로그아웃"}
                </button>
                </div>
            </>   
        )}
    </div>
  </nav>
}