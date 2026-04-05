import { useEffect, useState } from "react"
import axios from "axios";
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
export default function MoviePage() {
  const[movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovie = async () => { // 주소 에러 발생 -> 
      const {data} = await axios.get<MovieResponse>('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc',
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
            //'Content-Type': 'application/json;charset=utf-8' // <- application/json은 기본적으로 처리되어있음
          }
        }
      );
      //console.log(data); //promise의 값 async -> resolve하는 과정 필요
      setMovies(data.results);
    };

    fetchMovie();
  }, []);
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-10'>
      {movies.map((movie) => {
        return (
          <MovieCard key={movie.id} movie={movie} />
        );
      })}
    </div>
  )
}