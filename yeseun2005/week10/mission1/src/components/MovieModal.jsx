import { memo, useCallback } from "react";

function MovieModal({ movie, onClose }) {
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  const handleImdbSearch = useCallback(() => {
    window.open(
      `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`,
      "_blank"
    );
  }, [movie.title]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
            ×
        </button>

        <div
          className="modal-hero"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          <div className="modal-hero-overlay">
            <h2>{movie.title}</h2>
            <p>{movie.original_title}</p>
          </div>
        </div>

        <div className="modal-detail">
          <img src={posterUrl} alt={movie.title} />

          <div className="modal-info">
            <p>
              <strong>평점</strong>
              <br />
              ⭐ {movie.vote_average}
            </p>

            <p>
              <strong>개봉일</strong>
              <br />
              {movie.release_date || "정보 없음"}
            </p>

            <p>
                <strong>줄거리</strong>
            </p>

            <p className="overview">
                {movie.overview || "줄거리 정보가 없습니다."}
            </p>

            <div className="modal-buttons">
              <button onClick={handleImdbSearch}>IMDb에서 검색</button>
              <button onClick={onClose}>닫기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(MovieModal);