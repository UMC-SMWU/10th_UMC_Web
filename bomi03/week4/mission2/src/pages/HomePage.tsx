import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { PAGINATION_ORDER } from "../enums/common";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import CreateLpModal from "../components/LpModal/CreateLpModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetInfiniteLpList({
    limit: 20,
    search,
    order,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleToggleOrder = (selectedOrder: PAGINATION_ORDER) => {
    setOrder(selectedOrder);
  };

  const handleOpenCreateModal = () => {
    if (!accessToken) {
      alert("LP를 작성하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    setIsCreateModalOpen(true);
  };

  if (isError) {
    return (
      <div className="px-6 py-8">
        <p className="mb-3">LP 목록을 불러오지 못했습니다.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => handleToggleOrder(PAGINATION_ORDER.asc)}
          className={`rounded px-3 py-1 text-sm ${
            order === PAGINATION_ORDER.asc
              ? "bg-white text-black"
              : "bg-gray-800 text-white"
          }`}
        >
          오래된순
        </button>

        <button
          type="button"
          onClick={() => handleToggleOrder(PAGINATION_ORDER.desc)}
          className={`rounded px-3 py-1 text-sm ${
            order === PAGINATION_ORDER.desc
              ? "bg-white text-black"
              : "bg-gray-800 text-white"
          }`}
        >
          최신순
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="mb-6 w-full rounded border border-gray-500 bg-black px-3 py-2 text-white outline-none"
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {isLoading && <LpCardSkeletonList count={20} />}

        {data?.pages.map((page) =>
          page.data.map((lp) => <LpCard key={lp.id} lp={lp} />),
        )}

        {isFetchingNextPage && <LpCardSkeletonList count={10} />}
      </div>

      <div ref={ref} className="h-10" />

      <button
        type="button"
        onClick={handleOpenCreateModal}
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-3xl font-bold text-white shadow-lg hover:bg-pink-600"
      >
        +
      </button>

      {isCreateModalOpen && (
        <CreateLpModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
};

export default HomePage;
