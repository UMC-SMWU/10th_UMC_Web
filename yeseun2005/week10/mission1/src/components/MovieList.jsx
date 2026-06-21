import { memo } from "react";
import MovieCard from "./MovieCard";

function MovieList({ movies, onMovieClick }) {
  console.log("MovieList 렌더링");

  return (
    <section className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onMovieClick={onMovieClick}
        />
      ))}
    </section>
  );
}

export default memo(MovieList);