import { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import useGetInfiniteSearchLps from "../hooks/queries/useGetInfiniteSearchLps";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError } =
    useGetInfiniteSearchLps(debouncedSearch);

  const lps = data?.pages.flatMap((page) => page.data.data) ?? [];

  return (
    <div className="p-8">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="w-full rounded-md border border-gray-500 bg-black px-4 py-3 text-white"
      />

      {search.trim() === "" && (
        <p className="mt-4 text-gray-400">검색어를 입력해주세요.</p>
      )}

      {isLoading && <p className="mt-4 text-white">검색 중...</p>}
      {isError && <p className="mt-4 text-red-500">검색 실패</p>}

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {lps.map((lp) => (
          <div key={lp.id}>
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="h-40 w-full rounded-md object-cover"
            />
            <p className="mt-2 text-white">{lp.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;