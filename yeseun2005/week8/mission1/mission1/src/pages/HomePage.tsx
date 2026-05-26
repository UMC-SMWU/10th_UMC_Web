import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../types/common";
import AddLpModal from "../components/AddLpModal";

const HomePage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [isAddLpModalOpen, setIsAddLpModalOpen] = useState(false);

  const { data, isPending, isError, refetch } = useGetLpList({
    cursor: 0,
    order,
    limit: 20,
  });

  const handleToggleOrder = () => {
    setOrder((prev) =>
      prev === PAGINATION_ORDER.desc
        ? PAGINATION_ORDER.asc
        : PAGINATION_ORDER.desc
    );
  };

  if (isPending) {
    return <div className="px-6 py-8">로딩 중...</div>;
  }

  if (isError) {
    return (
      <div className="px-6 py-8">
        <p>LP 목록을 불러오지 못했습니다.</p>
        <button onClick={() => refetch()}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleToggleOrder}
          className="rounded bg-gray-800 px-4 py-2 text-white"
        >
          {order === PAGINATION_ORDER.desc ? "최신순" : "오래된순"}
        </button>
      </div>

      {data?.data.data.length === 0 && (
        <p className="mt-20 text-center text-gray-500">표시할 LP가 없습니다.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {data?.data.data.map((lp) => (
          <div
            key={lp.id}
            onClick={() => navigate(`/lp/${lp.id}`)}
            className="group relative cursor-pointer overflow-hidden rounded-lg shadow"
          >
            <img
              src={lp.thumbnail || "https://placehold.co/300x300"}
              alt={lp.title}
              className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            <div className="absolute inset-0 flex flex-col justify-end bg-black/60 p-4 text-white opacity-0 transition group-hover:opacity-100">
              <h2 className="font-bold">{lp.title}</h2>
              <p className="text-sm">좋아요 {lp.likes.length}개</p>
              <p className="text-xs">
                {new Date(lp.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setIsAddLpModalOpen(true)}
        className="fixed bottom-8 right-8 rounded-full bg-pink-500 px-5 py-4 text-xl font-bold text-white shadow-lg"
      >
        +
      </button>

      {isAddLpModalOpen && (
        <AddLpModal onClose={() => setIsAddLpModalOpen(false)} />
      )}
    </div>
  );
};

export default HomePage;