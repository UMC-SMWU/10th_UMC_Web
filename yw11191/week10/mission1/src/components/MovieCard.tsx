import { memo } from "react";
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export const MovieCard = memo(({ movie, onClick }: MovieCardProps) => {
  return (
    <div 
      onClick={() => onClick(movie)}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 flex flex-col h-full relative"
    >
      {/* 썸네일 & 평점 뱃지 */}
      <div className="relative aspect-[2/3] bg-gray-200">
        {movie.poster_path ? (
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
        )}
        <div className="absolute top-2 right-2 bg-[#3b82f6] text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
          {movie.vote_average?.toFixed(1)}
        </div>
      </div>

      {/* 텍스트 정보 */}
      <div className="p-4 flex-1 flex flex-col justify-center text-center">
        <h3 className="font-bold text-gray-900 text-[15px] truncate mb-1">{movie.title}</h3>
        <p className="text-xs text-gray-500">{movie.release_date || "개봉일 미상"}</p>
      </div>
    </div>
  );
});