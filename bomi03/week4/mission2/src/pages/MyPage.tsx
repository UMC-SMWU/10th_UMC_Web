import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import useUpdateMyInfo from "../hooks/mutations/useUpdateMyInfo";

const MyPage = () => {
  const { accessToken } = useAuth();
  const { data, isPending } = useGetMyInfo(accessToken);
  const updateMyInfoMutation = useUpdateMyInfo();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleOpenEdit = () => {
    if (!data) return;

    setName(data.data.name ?? "");
    setBio(data.data.bio ?? "");
    setAvatar(data.data.avatar ?? "");
    setIsEditing(true);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    updateMyInfoMutation.mutate(
      {
        name: name.trim(),
        bio: bio.trim() || null,
        avatar: avatar.trim() || null,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  if (isPending || !data) {
    return (
      <div className="p-8 text-white">사용자 정보를 불러오는 중입니다.</div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black p-8 text-white">
      <div className="mx-auto max-w-3xl rounded-2xl bg-[#242833] p-8">
        <div className="mb-8 flex items-center gap-6">
          {data.data.avatar ? (
            <img
              src={data.data.avatar}
              alt="프로필 이미지"
              className="h-32 w-32 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-300 text-5xl">
              👤
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-2xl font-bold">{data.data.name}</h1>
            <p className="mt-2 text-gray-300">{data.data.bio ?? "bio 없음"}</p>
            <p className="mt-2 text-gray-400">{data.data.email}</p>
          </div>

          <button
            type="button"
            onClick={handleOpenEdit}
            className="rounded-md bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
          >
            설정
          </button>
        </div>

        {isEditing && (
          <div className="mt-8 rounded-xl border border-gray-600 p-5">
            <h2 className="mb-4 text-lg font-bold">내 정보 수정</h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              className="mb-3 w-full rounded-md border border-gray-500 bg-transparent px-3 py-2 text-white outline-none"
            />

            <input
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
              className="mb-3 w-full rounded-md border border-gray-500 bg-transparent px-3 py-2 text-white outline-none"
            />

            <input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="프로필 사진 URL"
              className="mb-4 w-full rounded-md border border-gray-500 bg-transparent px-3 py-2 text-white outline-none"
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!name.trim() || updateMyInfoMutation.isPending}
              className="rounded-md bg-pink-500 px-5 py-2 text-white hover:bg-pink-600 disabled:bg-gray-500"
            >
              {updateMyInfoMutation.isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
