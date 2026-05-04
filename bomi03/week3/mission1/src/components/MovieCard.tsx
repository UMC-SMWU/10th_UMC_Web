import { useState } from "react";
import type { Movie } from "../types/movie";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : "https://placehold.co/300x450?text=No+Image";

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer
      bg-white shadow-md hover:shadow-2xl
      transition-all duration-300 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-2/3 overflow-hidden">
        <img
          src={poster}
          alt={`${movie.title} 포스터`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* hover overlay */}
        <div
          className={`absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-transparent
          transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {isHovered && (
          <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
            <p className="text-xs text-gray-200 mb-1">
              평점 {movie.vote_average.toFixed(1)}
            </p>

            <h2 className="text-base font-bold leading-snug line-clamp-2">
              {movie.title}
            </h2>

            <p className="text-xs text-gray-200 mt-2 line-clamp-4 leading-relaxed">
              {movie.overview || "줄거리 정보가 없습니다."}
            </p>
          </div>
        )}
      </div>

      {/* 카드 하단 기본 정보 */}
      <div className="px-3 py-4">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
          {movie.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{movie.release_date}</p>
      </div>
    </div>
  );
}