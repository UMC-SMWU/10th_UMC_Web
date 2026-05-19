import { useState } from "react";
import { PAGINATION_ORDER } from "../enums/common";
import useGetLpList from "../hooks/queries/useGetLpList";
import LpCard from "../components/LpCard";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

  const { data, isPending, isError, refetch } = useGetLpList({
    cursor: 0,
    search,
    order,
    limit: 20,
  });

  const handleToggleOrder = (selectedOrder: PAGINATION_ORDER) => {
    setOrder(selectedOrder);
  };

  if (isPending) {
    return <div className="mt-20 px-6">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="mt-20 px-6">
        <p>LP 목록을 불러오지 못했습니다.</p>
        <button onClick={() => refetch()}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="mb-4 flex justify-end gap-2">
        <button
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
        className="mb-6 w-full rounded border px-3 py-2"
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {data?.map((lp) => (
          <LpCard key={lp.id} lp={lp} />
        ))}
      </div>

      <button
        onClick={() => alert("LP 생성 페이지는 이후 구현")}
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-3xl font-bold text-white shadow-lg"
      >
        +
      </button>
    </div>
  );
};

export default HomePage;
