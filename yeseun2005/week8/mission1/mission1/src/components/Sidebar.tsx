import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useDeleteUser from "../hooks/mutations/useDeleteUser";

const Sidebar = () => {
  const navigate = useNavigate();



  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { mutate: deleteUserMutate, isPending } = useDeleteUser();

  const handleDeleteUser = () => {
    deleteUserMutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
      }
    });
  };

  return (
    <>
      <aside className="hidden min-h-[calc(100vh-80px)] w-52 flex-col gap-6 bg-black p-6 text-white md:flex">
        <Link to="/search" className="hover:text-pink-400">
          🔍 찾기
        </Link>

        <Link to="/my" className="hover:text-pink-400">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
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