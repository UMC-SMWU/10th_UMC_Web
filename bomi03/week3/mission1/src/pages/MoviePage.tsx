import { useState } from "react";
import { type MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import useCustomFetch from "../hooks/useCustomFetch";

type PageByCategory = Record<string, number>;

const categoryTitleMap: Record<string, string> = {
  popular: "인기 영화",
  now_playing: "상영 중인 영화",
  top_rated: "평점 높은 영화",
  upcoming: "개봉 예정 영화",
};

export default function MoviePage() {
  const { category } = useParams<{ category: string }>();

  // 카테고리별 페이지 상태를 관리하여 category 변경 시 자연스럽게 1페이지부터 시작
  const [pageByCategory, setPageByCategory] = useState<PageByCategory>({});

  const currentCategory = category ?? "popular";
  const page = pageByCategory[currentCategory] ?? 1;

  const url = `https://api.themoviedb.org/3/movie/${currentCategory}?language=ko-KR&page=${page}`;

  // 커스텀 훅으로 데이터/로딩/에러 상태를 공통 관리
  const { data, isPending, isError, errorMessage } =
    useCustomFetch<MovieResponse>(url);

  const movies = data?.results ?? [];

  const changePage = (nextPage: number) => {
    setPageByCategory((prev) => ({
      ...prev,
      [currentCategory]: nextPage,
    }));
  };

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] bg-linear-to-b from-[#f8f7ff] to-[#fdfdfd]">
        {/* 사용자 친화적인 에러 메시지 */}
        <div className="bg-white px-8 py-6 rounded-2xl shadow-md border border-red-100">
          <p className="text-red-500 text-lg font-medium text-center">
            {errorMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    // Tailwind CSS로 전체 페이지 디자인 강화
    <div className="min-h-screen bg-linear-to-b from-[#f8f7ff] via-[#fcfcff] to-[#ffffff]">
      {/* 상단 소개 영역 */}
      <section className="px-8 pt-10 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-white/80 backdrop-blur-sm shadow-sm border border-gray-100 px-8 py-10">
            <p className="text-sm font-semibold text-[#b588d8] tracking-wide">
              MOVIE COLLECTION
            </p>

            <h1 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
              {categoryTitleMap[currentCategory] ?? "영화 목록"}
            </h1>

            <p className="mt-3 text-gray-500 leading-relaxed">
              다양한 영화 정보를 둘러보고, 포스터를 클릭해 상세 페이지에서 감독과
              출연진 정보까지 확인해보세요.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full bg-[#f3e8ff] text-[#9d5bd2] text-sm font-medium">
                현재 페이지 {page}
              </span>
              <span className="px-4 py-2 rounded-full bg-[#eaf8ea] text-[#5f9f63] text-sm font-medium">
                총 영화 수 {movies.length}개
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 페이지 이동 버튼 */}
      <section className="px-8 pb-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
          <button
            className="px-5 py-3 rounded-2xl bg-white shadow-sm border border-gray-200 text-gray-700
            hover:bg-[#f8efff] hover:text-[#9d5bd2] hover:border-[#e8d2fb]
            transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400
            disabled:border-gray-200 disabled:cursor-not-allowed cursor-pointer"
            disabled={page === 1}
            onClick={() => changePage(page - 1)}
          >
            이전
          </button>

          <div className="px-6 py-3 rounded-2xl bg-linear-to-r from-[#dda5e3] to-[#b2dab1] text-white font-semibold shadow-md">
            {page} 페이지
          </div>

          <button
            className="px-5 py-3 rounded-2xl bg-white shadow-sm border border-gray-200 text-gray-700
            hover:bg-[#eef8ee] hover:text-[#5f9f63] hover:border-[#cfe7cf]
            transition-all duration-200 cursor-pointer"
            onClick={() => changePage(page + 1)}
          >
            다음
          </button>
        </div>
      </section>

      {/* 로딩 UI */}
      {isPending && (
        <div className="flex flex-col items-center justify-center min-h-[55vh] gap-4">
          {/* 로딩 상태 표시 */}
          <LoadingSpinner />
          <p className="text-gray-500 text-sm">영화 정보를 불러오는 중입니다...</p>
        </div>
      )}

      {/* 영화 카드 그리드 */}
      {!isPending && (
        <section className="px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div
              className="grid gap-7
              grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            >
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}