import { memo } from "react";
import type { Movie } from "../types/movie";

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MovieModal = memo(({ movie, isOpen, onClose }: MovieModalProps) => {
  if (!isOpen || !movie) return null;

  const handleImdbClick = () => {
    window.open(`https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* 상단 스틸컷 영역 */}
        <div className="relative w-full h-48 md:h-64 bg-gray-900">
          {movie.backdrop_path ? (
            <img 
              src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`} 
              alt="스틸컷" 
              className="w-full h-full object-cover opacity-70"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">배경 이미지가 없습니다</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/30 hover:bg-black/60 text-white text-xl font-bold rounded-full backdrop-blur-md transition-colors"
          >
            &times;
          </button>
        </div>

        {/* 하단 상세 정보 영역 */}
        <div className="flex flex-col md:flex-row px-6 md:px-8 pb-8 -mt-12 md:-mt-16 relative z-10 gap-6 md:gap-8">
          
          <div className="shrink-0 mx-auto md:mx-0 w-32 md:w-48 aspect-[2/3] rounded-xl overflow-hidden shadow-xl bg-gray-200 self-start">
            {movie.poster_path ? (
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
            )}
          </div>

          {/* 텍스트 정보 */}
          <div className="flex-1 flex flex-col mt-2 md:mt-16">
            
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-2.5 py-1 bg-[#3b82f6] text-white text-xs font-bold rounded">
                  ★ {movie.vote_average?.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  ({movie.vote_count?.toLocaleString()}명 평가)
                </span>
              </div>
              
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1 leading-tight">{movie.title}</h2>
              <p className="text-sm text-gray-500 font-medium mb-3">{movie.original_title}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 font-semibold bg-gray-50 p-2 rounded-lg inline-flex">
                <span>📅 {movie.release_date || "개봉일 미상"}</span>
                <span className="text-gray-300">|</span>
                <span>🔥 인기도: {movie.popularity?.toFixed(0)}</span>
              </div>
            </div>
            
            <hr className="my-2 border-gray-100" />
            
            {/* 줄거리 */}
            <div className="flex-1 overflow-y-auto max-h-32 md:max-h-40 pr-2 my-4 text-sm text-gray-700 leading-relaxed custom-scrollbar">
              {movie.overview || "등록된 줄거리가 없습니다."}
            </div>

            {/* IMDb 버튼 */}
            <button 
              onClick={handleImdbClick}
              className="w-full mt-auto py-3.5 bg-[#f5c518] hover:bg-[#e3b516] text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              IMDb에서 검색하기
            </button>
          </div>
        </div>

      </div>
    </div>
  );
});