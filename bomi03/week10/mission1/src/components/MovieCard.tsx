import { memo } from "react";
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieCard = memo(({ movie, onSelectMovie }: MovieCardProps) => {
  console.log("MovieCard 렌더링:", movie.title);

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <article
      onClick={() => onSelectMovie(movie)}
      className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative">
        <img
          src={posterUrl}
          alt={movie.title}
          className="h-[360px] w-full object-cover"
        />

        <span className="absolute right-2 top-2 rounded-md bg-blue-500 px-2 py-1 font-bold text-white">
          {movie.vote_average.toFixed(1)}
        </span>
      </div>

      <div className="p-4">
        <h2 className="truncate text-lg font-bold text-gray-900">
          {movie.title}
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {movie.release_date || "개봉일 정보 없음"}
        </p>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
          {movie.overview || "줄거리 정보가 없습니다."}
        </p>
      </div>
    </article>
  );
});

export default MovieCard;
