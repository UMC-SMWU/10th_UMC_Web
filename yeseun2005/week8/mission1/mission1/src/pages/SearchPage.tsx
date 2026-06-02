import { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import useGetInfiniteSearchLps from "../hooks/queries/useGetInfiniteSearchLps";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data } =
    useGetInfiniteSearchLps(debouncedSearch);

  const lps = data?.pages.flatMap((page) => page.data.data) ?? [];

  return (
  <div className="mx-auto max-w-5xl p-8">
    <h1 className="mb-6 text-2xl font-bold text-white">LP 검색</h1>

    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="검색어를 입력하세요"
      className="w-full rounded-xl border border-gray-600 bg-gray-900 px-5 py-3 text-white outline-none focus:border-pink-500"
    />

    {search.trim() === "" && (
      <p className="mt-4 text-gray-400">검색어를 입력해주세요.</p>
    )}

    <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
      {lps.map((lp) => (
        <div key={lp.id} className="rounded-xl bg-gray-900 p-3">
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="h-40 w-full rounded-lg object-cover"
          />
          <p className="mt-3 truncate font-semibold text-white">
            {lp.title}
          </p>
        </div>
    ))}
    </div>
    </div>
    );
};

export default SearchPage;