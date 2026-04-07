import { useEffect, useState } from "react";
import axios from "axios"; // 터미널에서 npm add axios 필요
import { type Movie, type MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]); // 영화를 담을 상태 (Movie만 들어갈 수 있는 배열이라고 알려줌)
  
  //1. 로딩 상태
  const [isPending, setIsPending] = useState(false);
  //2. 에러 상태
  const [isError, setIsError] = useState(false);
  //3. 페이지
  const [page, setPage] = useState(1);

  const {category} = useParams<{ category: string }>();

  useEffect((): void => {
    const fetchMovies = async () => {
      setIsPending(true); // fetchMovies를 시작하는 상황에서는 로딩 상태가 데이터를 호출하는 중이니까 이때는 항상 setIsPending이 true
      try {
        const { data } = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`, // 동적으로 받을 수 있게 page 처리
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        setMovies(data.results);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovies();
  }, [page, category]);

  if (isError) {
    return (
      <div>
        <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }

  // 여기에 로딩스피너 쓰면 문제점은 실제 데이터와 상관있는 부분은 하단 UI인데 상단의 버튼까지 다 지워버림

  return (
    <>
      <div className="flex items-center justify-center gap-6 mt-5">
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1] 
          transition-all duration-200 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed" // cursor-pointer로 클릭할 수 있다는 것을 나타내기 위해 커서에 포인터 표시, disabled:cursor-not-allowed로 페이지가 1일 때는 클릭할 수 없다는 것을 나타내기 위해 커서에 금지 표시
          disabled={page === 1} // 페이지가 1일 때는 이전 버튼이 비활성화 되도록 disabled 처리
          onClick={(): void => setPage((prev): number => prev - 1)}
        >
          {"<"}
        </button>
        <span>{page} 페이지</span>
        {/* 몇 페이지인지 알려주는 텍스트 */}
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1] 
          transition-all duration-200 disabled:bg-gray-300 cursor-pointer "
          onClick={(): void => setPage((prev): number => prev + 1)}
        >
          {">"}
        </button>
      </div>

      {/* 로딩스피너를 여기서 사용 */}
      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {!isPending && (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies && movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      )}
    </>
  );
}