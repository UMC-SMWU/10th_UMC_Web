import { useCallback, useEffect, useMemo, useState } from "react";
import { searchMovies } from "./api/tmdb";
import MovieList from "./components/MovieList";
import MovieModal from "./components/MovieModal";

function App() {
  console.log("App 렌더링");

  const [query, setQuery] = useState("");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState("ko-KR");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault();

      if (!query.trim()) {
        alert("영화 제목을 입력해주세요.");
        return;
      }

      try {
        setIsLoading(true);

        const results = await searchMovies({
          query,
          includeAdult,
          language,
        });

        setMovies(results);
      } catch (error) {
        console.error(error);
        alert("영화 검색 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    },
    [query, includeAdult, language]
  );

  useEffect(() => {
  const fetchInitialMovies = async () => {
    try {
      setIsLoading(true);

      const results = await searchMovies({
        query: "명탐정 코난",
        includeAdult: false,
        language: "ko-KR",
      });

      setMovies(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchInitialMovies();
}, []);

  const sortedMovies = useMemo(() => {
    console.log("영화 정렬 계산 실행");

    return [...movies].sort((a, b) => b.vote_average - a.vote_average);
  }, [movies]);

  const handleMovieClick = useCallback((movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  return (
    <main className="container">
      <h1>🎬 영화 검색</h1>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="영화 제목을 입력하세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={includeAdult}
            onChange={(e) => setIncludeAdult(e.target.checked)}
          />
          성인 콘텐츠 포함
        </label>

        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="ko-KR">한국어</option>
          <option value="en-US">영어</option>
          <option value="ja-JP">일본어</option>
        </select>

        <button type="submit">검색</button>
      </form>

      {isLoading && <p className="message">검색 중입니다...</p>}

      {!isLoading && sortedMovies.length === 0 && (
        <p className="message">검색 결과가 없습니다.</p>
      )}

      <MovieList movies={sortedMovies} onMovieClick={handleMovieClick} />

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </main>
  );
}

export default App;