import React, { useState, useCallback, useMemo } from "react";
import { SearchForm } from "../components/SearchForm";
import { MovieCard } from "../components/MovieCard";
import { MovieModal } from "../components/MovieModal";
import { tmdbApi } from "../apis/tmdb";
import type { Movie } from "../types/movie";

export default function MovieSearchPage() {
  // 상태 관리
  const [keyword, setKeyword] = useState("");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState("ko-KR");
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // useCallback
  const handleChangeKeyword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const handleToggleAdult = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeAdult(e.target.checked);
  }, []);

  const handleChangeLanguage = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  }, []);

  // API 호출
  const handleSearchSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setIsLoading(true);
    try {
      const response = await tmdbApi.get("/search/movie", {
        params: {
          query: keyword,
          include_adult: includeAdult,
          language: language,
        }
      });
      setMovies(response.data.results);
    } catch (error) {
      console.error("영화 검색 실패:", error);
      alert("영화 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [keyword, includeAdult, language]);

  // 모달 핸들러
  const handleOpenModal = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMovie(null), 300);
  }, []);

  // useMemo
  const highRatedCount = useMemo(() => {
    return movies.filter(m => m.vote_average >= 8).length;
  }, [movies]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <SearchForm 
          keyword={keyword}
          includeAdult={includeAdult}
          language={language}
          onChangeKeyword={handleChangeKeyword}
          onToggleAdult={handleToggleAdult}
          onChangeLanguage={handleChangeLanguage}
          onSubmit={handleSearchSubmit}
        />

        {/* 상단 통계 바 */}
        {movies.length > 0 && (
          <div className="mb-6 flex justify-between items-center text-sm text-gray-600">
            <p>총 <span className="font-bold">{movies.length}</span>개의 영화를 찾았습니다.</p>
            <p>명작(평점 8 이상): <span className="font-bold text-blue-600">{highRatedCount}</span>개</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20 text-gray-500 font-bold">검색 중...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onClick={handleOpenModal} 
              />
            ))}
          </div>
        )}

        {!isLoading && movies.length === 0 && keyword && (
          <div className="text-center py-20 text-gray-400">검색 결과가 없습니다.</div>
        )}

        <MovieModal 
          movie={selectedMovie}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />

      </div>
    </div>
  );
}