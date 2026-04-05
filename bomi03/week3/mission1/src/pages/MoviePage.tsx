import { useEffect, useState } from "react";
import axios from "axios"; // 터미널에서 npm add axios 필요
import { type Movie, type MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]); // 영화를 담을 상태 (Movie만 들어갈 수 있는 배열이라고 알려줌)

  useEffect((): void => {
    const fetchMovies = async () => { // useEffect 내부에서 async 함수를 직접 사용할 수 없으므로, 내부에 별도의 async 함수를 정의하여 호출
      const { data } = await axios.get<MovieResponse>( // fetch 대신 axios를 사용하여 API 호출 (더 간편함)
        `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
        }
      );

      setMovies(data.results);
      console.log(import.meta.env.VITE_TMDB_KEY);
    };

    fetchMovies();
  }, []); // 마운트될 때 한 번만 실행

  return (
    <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies && movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
    </div>
  );
}