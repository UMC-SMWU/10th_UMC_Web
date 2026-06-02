import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useDeleteUser from "../hooks/mutations/useDeleteUser";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const { accessToken, clearAuth } = useAuth();

  const deleteUserMutation = useDeleteUser();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteUser = () => {
    deleteUserMutation.mutate(undefined, {
      onSuccess: () => {
        clearAuth();

        setIsDeleteModalOpen(false);
        onClose();
        navigate("/login");
      },
    });
  };

  return (
    <>
      {/* 사이드바가 열렸을 때 외부 불투명 회색 배경 표시 */}
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 z-20 bg-gray-600/60" />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-30 w-80 bg-white text-gray-900 transition-transform duration-300 ease-in-out dark:bg-gray-900 dark:text-white
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="px-10 py-10">
          <h2 className="mb-12 text-2xl font-bold">돌려돌려 LP판</h2>

          <nav className="flex flex-col gap-7 text-lg font-semibold">
            <Link
              to="/search"
              onClick={onClose}
              className="flex items-center gap-4 text-gray-900 dark:text-white"
            >
              <span>🔍</span>
              <span>찾기</span>
            </Link>

            <Link
              to="/mypage"
              onClick={onClose}
              className="flex items-center gap-4 text-gray-900 dark:text-white"
            >
              <span>👤</span>
              <span>마이페이지</span>
            </Link>
          </nav>
        </div>

        {accessToken && (
          <button
            type="button"
            onClick={handleOpenDeleteModal}
            className="absolute bottom-8 left-10 text-sm text-gray-400 hover:text-pink-400"
          >
            탈퇴하기
          </button>
        )}
      </aside>

      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={handleCloseDeleteModal}
        >
          <div
            className="relative w-[420px] rounded-xl bg-[#242833] p-8 text-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCloseDeleteModal}
              className="absolute right-5 top-4 text-xl text-white hover:text-pink-400"
            >
              ×
            </button>

            <p className="mb-8 text-center text-lg font-semibold">
              정말 탈퇴하시겠습니까?
            </p>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={deleteUserMutation.isPending}
                className="rounded-md bg-gray-200 px-8 py-2 text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteUserMutation.isPending ? "처리 중..." : "예"}
              </button>

              <button
                type="button"
                onClick={handleCloseDeleteModal}
                className="rounded-md bg-pink-500 px-8 py-2 text-white hover:bg-pink-600"
              >
                아니오
              </button>
            </div>

            {deleteUserMutation.isError && (
              <p className="mt-4 text-center text-sm text-red-400">
                탈퇴 처리에 실패했습니다.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
