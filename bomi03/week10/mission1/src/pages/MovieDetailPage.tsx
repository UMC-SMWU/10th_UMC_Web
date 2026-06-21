import { Link, useParams } from "react-router-dom";
import { useMemo } from "react";

import useFetch from "../hooks/useFetch";
import type { Movie } from "../types/movie";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function MovieDetailPage() {
  const { movieId } = useParams();

  const requestOptions = useMemo(
    () => ({
      params: {
        language: "ko-KR",
      },
    }),
    [],
  );

  const {
    data: movie,
    error,
    isLoading,
  } = useFetch<Movie>(`/movie/${movieId}`, requestOptions);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg font-semibold">
        로딩 중 입니다...
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-500">영화 상세 정보를 불러오지 못했습니다.</p>
        <Link to="/" className="rounded-md bg-blue-500 px-4 py-2 text-white">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-xl">
        <Link
          to="/"
          className="mb-8 inline-block rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
        >
          ← 홈으로 돌아가기
        </Link>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full rounded-lg shadow-md"
          />

          <section>
            <h1 className="text-3xl font-bold text-gray-900">{movie.title}</h1>
            <p className="mt-2 text-gray-500">{movie.original_title}</p>

            <div className="mt-6 space-y-4">
              <p>
                <span className="font-semibold">평점: </span>
                {movie.vote_average.toFixed(1)}
              </p>

              <p>
                <span className="font-semibold">개봉일: </span>
                {movie.release_date || "정보 없음"}
              </p>

              <p>
                <span className="font-semibold">인기도: </span>
                {movie.popularity.toFixed(1)}
              </p>

              <div>
                <h2 className="mb-2 text-lg font-bold">줄거리</h2>
                <p className="leading-7 text-gray-700">
                  {movie.overview || "줄거리 정보가 없습니다."}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
