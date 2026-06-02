import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useDeleteUser from "../hooks/mutations/useDeleteUser";
import { useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  close: () => void;
}

const Sidebar = ({ isOpen, close }: SidebarProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                close();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
        }, [close]);

        useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);
    
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { mutate: deleteUserMutate, isPending } = useDeleteUser();

  const handleDeleteUser = () => {
    deleteUserMutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
      },
    });
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={close}
          className="fixed inset-0 z-40 bg-black/50"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col gap-6 bg-black p-6 text-white transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={close}
          className="mb-4 self-end text-2xl text-white"
        >
          ×
        </button>

        <Link to="/search" onClick={close} className="hover:text-pink-400">
          🔍 찾기
        </Link>

        <Link to="/my" onClick={close} className="hover:text-pink-400">
          👤 마이페이지
        </Link>

        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          className="text-left text-red-400 hover:text-red-300"
        >
          🚨 탈퇴하기
        </button>
      </aside>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="w-80 rounded-xl bg-white p-6 text-black shadow-lg">
            <h2 className="mb-4 text-xl font-bold">회원 탈퇴</h2>

            <p className="mb-6 text-sm text-gray-600">
              정말 탈퇴하시겠습니까?
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded bg-gray-200 px-4 py-2"
              >
                아니오
              </button>

              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isPending}
                className="rounded bg-red-500 px-4 py-2 text-white disabled:bg-gray-300"
              >
                {isPending ? "탈퇴 중..." : "예"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;