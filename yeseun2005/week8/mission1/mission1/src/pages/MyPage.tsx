import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import useUpdateMyInfo from "../hooks/mutations/useUpdateMyInfo";

const MyPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const { data, isPending, isError } = useGetMyInfo();
  const { mutate: updateMyInfoMutate, isPending: isUpdating } =
    useUpdateMyInfo();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (data?.data) {
      setName(data.data.name ?? "");
      setBio(data.data.bio ?? "");
      setAvatar(data.data.avatar ?? "");
    }
  }, [data]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleUpdateMyInfo = () => {
    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    updateMyInfoMutate(
      {
        name,
        bio,
        avatar,
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          alert("프로필이 수정되었습니다.");
        },
        onError: () => {
          alert("프로필 수정에 실패했습니다.");
        },
      }
    );
  };

  if (isPending) {
    return <div className="p-6">마이페이지 불러오는 중...</div>;
  }

  if (isError) {
    return <div className="p-6">마이페이지 정보를 불러오지 못했습니다.</div>;
  }

  return (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-bold">
        {data?.data?.name}님 환영합니다.
      </h1>

      <img
        src={data?.data?.avatar || "https://placehold.co/120x120"}
        alt="프로필 이미지"
        className="mx-auto mb-6 h-36 w-36 rounded-full object-cover shadow"
      />

      <div className="mb-8 space-y-3 text-lg">
        <p>
          <span className="font-semibold">이메일:</span>{" "}
          {data?.data?.email}
        </p>

        <p>
          <span className="font-semibold">Bio:</span>{" "}
          {data?.data?.bio || "작성된 bio가 없습니다."}
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
          className="rounded-lg bg-pink-500 px-5 py-3 font-semibold text-white transition hover:bg-pink-600"
        >
          설정
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg bg-blue-300 px-5 py-3 font-semibold transition hover:bg-blue-400"
        >
          로그아웃
        </button>
      </div>
    </div>

    {isEditModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-96 rounded-2xl bg-white p-6 text-black shadow-xl">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">프로필 수정</h2>

            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              className="rounded-lg border px-4 py-3"
            />

            <input
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
              className="rounded-lg border px-4 py-3"
            />

            <input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="프로필 이미지 URL"
              className="rounded-lg border px-4 py-3"
            />

            <input
              type="file"
              className="rounded-lg border px-4 py-3"
            />

            <button
              type="button"
              onClick={handleUpdateMyInfo}
              disabled={isUpdating}
              className="mt-3 rounded-lg bg-pink-500 px-4 py-3 font-semibold text-white disabled:bg-gray-300"
            >
              {isUpdating ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
  
};

export default MyPage;