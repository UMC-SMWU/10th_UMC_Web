import { useCallback, useMemo, useState } from "react";

import MovieFilter from "../components/MovieFilter";
import MovieList from "../components/MovieList";
import MovieModal from "../components/MovieModal";
import useFetch from "../hooks/useFetch";
import type { Language, Movie, MovieResponse } from "../types/movie";

export default function HomePage() {
  console.log("HomePage 렌더링");

  const [title, setTitle] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState<Language>("ko-KR");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const isSearchMode = searchTitle.trim().length > 0;

  const requestUrl = isSearchMode ? "/search/movie" : "/movie/popular";

  const requestOptions = useMemo(
    () => ({
      params: isSearchMode
        ? {
            query: searchTitle,
            include_adult: includeAdult,
            language,
          }
        : {
            language,
          },
    }),
    [searchTitle, includeAdult, language, isSearchMode],
  );

  const { data, error, isLoading } = useFetch<MovieResponse>(
    requestUrl,
    requestOptions,
  );

  const movies = useMemo(() => {
    return (data?.results || [])
      .filter((movie) => movie.poster_path)
      .sort((a, b) => b.vote_average - a.vote_average);
  }, [data]);

  const handleTitleChange = useCallback((value: string) => {
    setTitle(value);
  }, []);

  const handleIncludeAdultChange = useCallback((value: boolean) => {
    setIncludeAdult(value);
  }, []);

  const handleLanguageChange = useCallback((value: Language) => {
    setLanguage(value);
  }, []);

  const handleSubmit = useCallback(() => {
    setSearchTitle(title.trim());
  }, [title]);

  const handleSelectMovie = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <MovieFilter
          title={title}
          includeAdult={includeAdult}
          language={language}
          onTitleChange={handleTitleChange}
          onIncludeAdultChange={handleIncludeAdultChange}
          onLanguageChange={handleLanguageChange}
          onSubmit={handleSubmit}
        />

        {isLoading ? (
          <div className="py-20 text-center text-lg font-semibold text-gray-500">
            로딩 중 입니다...
          </div>
        ) : (
          <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
        )}
      </div>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </main>
  );
}
