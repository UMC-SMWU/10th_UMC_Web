import { memo } from "react";

function MovieCard({ movie, onMovieClick }) {
  console.log("MovieCard 렌더링:", movie.title);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <article className="movie-card" onClick={() => onMovieClick(movie)}>
      <img src={posterUrl} alt={movie.title} />

      <div className="movie-card-content">
        <h3>{movie.title}</h3>
        <p>⭐ 평점: {movie.vote_average}</p>
        <p>📅 개봉일: {movie.release_date || "정보 없음"}</p>
      </div>
    </article>
  );
}

export default memo(MovieCard);