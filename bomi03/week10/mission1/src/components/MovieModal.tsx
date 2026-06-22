import { memo } from "react";
import type { Movie } from "../types/movie";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

const MovieModal = memo(({ movie, onClose }: MovieModalProps) => {
  console.log("MovieModal 렌더링:", movie.title);

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  const backdropUrl = movie.backdrop_path
    ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
    : posterUrl;

  const handleIMDbSearch = () => {
    window.open(
      `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-2xl text-white hover:bg-black"
        >
          ×
        </button>

        <div
          className="relative h-72 bg-cover bg-center"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          <div className="absolute bottom-8 left-8 text-white">
            <h2 className="text-3xl font-bold">{movie.title}</h2>
            <p className="mt-2 text-sm">{movie.original_title}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-[260px_1fr]">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full rounded-lg shadow-lg"
          />

          <div className="text-center md:text-left">
            <div className="mb-6 flex items-center justify-center gap-2 md:justify-start">
              <span className="text-2xl font-bold text-blue-500">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-500">({movie.vote_count} 평가)</span>
            </div>

            <div className="space-y-5">
              <div>
                <h3 className="mb-2 text-lg font-bold">개봉일</h3>
                <p>{movie.release_date || "정보 없음"}</p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-bold">인기도</h3>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${Math.min(movie.popularity / 10, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-bold">줄거리</h3>
                <p className="leading-7 text-gray-700">
                  {movie.overview || "줄거리 정보가 없습니다."}
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-3 md:justify-start">
              <button
                type="button"
                onClick={handleIMDbSearch}
                className="rounded-md bg-blue-500 px-5 py-3 font-semibold text-white hover:bg-blue-600"
              >
                IMDb에서 검색
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-blue-500 px-5 py-3 font-semibold text-blue-500 hover:bg-blue-50"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default MovieModal;
