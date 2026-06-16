import { memo, useCallback } from "react";

function MovieModal({ movie, onClose }) {
  console.log("MovieModal 렌더링");

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  const handleImdbSearch = useCallback(() => {
    const url = `https://www.imdb.com/find?q=${encodeURIComponent(
      movie.title
    )}`;

    window.open(url, "_blank");
  }, [movie.title]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <img className="modal-poster" src={posterUrl} alt={movie.title} />

        <div className="modal-content">
          <h2>{movie.title}</h2>

          <p>
            <strong>평점:</strong> {movie.vote_average}
          </p>

          <p>
            <strong>개봉일:</strong> {movie.release_date || "정보 없음"}
          </p>

          <p>
            <strong>줄거리:</strong>
          </p>

          <p className="overview">
            {movie.overview || "줄거리 정보가 없습니다."}
          </p>

          <div className="modal-buttons">
            <button onClick={handleImdbSearch}>IMDb에서 검색하기</button>
            <button onClick={onClose}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(MovieModal);