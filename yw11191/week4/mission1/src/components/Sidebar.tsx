import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Search, User, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { axiosInstance } from "../apis/axios";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogoutSuccess } = useAuth();
  
  // 탈퇴 확인 모달 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 탈퇴하기 useMutation
  const withdrawMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete("/v1/users");
      return response.data;
    },
    onSuccess: () => {
      handleLogoutSuccess();
      setIsDeleteModalOpen(false);
      alert("회원 탈퇴가 정상적으로 완료되었습니다.");
      navigate("/login");
    },
    onError: (error) => {
      console.error("회원 탈퇴 실패", error);
      alert("탈퇴 처리 중 문제가 발생했습니다.");
    }
  });

  const handleMenuClick = (path: string) => {
    navigate(path);
    onClose(); // 💡 메뉴를 클릭하면 자동으로 사이드바를 닫아줍니다 (모바일 대응)
  };

  return (
    <>
      <div className={`w-64 h-[calc(100vh-60px)] bg-[#121318] py-6 px-4 text-white border-r border-neutral-900 flex flex-col justify-between fixed left-0 top-15 z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        
        {/* 상단 메뉴 영역 */}
        <div className="space-y-2">
          <button
            onClick={() => handleMenuClick("/search")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              location.pathname === "/search" 
                ? "bg-neutral-800 text-white font-bold" 
                : "text-gray-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <Search size={18} />
            <span>찾기</span>
          </button>

          <button
            onClick={() => handleMenuClick("/mypage")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              location.pathname === "/mypage" 
                ? "bg-neutral-800 text-white font-bold" 
                : "text-gray-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <User size={18} />
            <span>마이페이지</span>
          </button>
        </div>

        {/* 탈퇴 버튼 영역 */}
        <div>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full text-left px-4 py-3 text-gray-500 hover:text-rose-500 transition-colors text-sm font-medium cursor-pointer"
          >
            탈퇴하기
          </button>
        </div>
      </div>
      {/* 회원 탈퇴 확인 모달 */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1b1c21] border border-neutral-800 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl relative">
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
              <h3 className="text-lg font-semibold mt-4 mb-2 text-white">정말 탈퇴하시겠습니까?</h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                탈퇴 시 기존의 모든 데이터가 삭제되며<br />복구할 수 없습니다.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)} 
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button 
                  onClick={() => withdrawMutation.mutate()} 
                  disabled={withdrawMutation.isPending} 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:bg-neutral-800"
                >
                  {withdrawMutation.isPending ? "탈퇴 중..." : "확인"}
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default Sidebar;