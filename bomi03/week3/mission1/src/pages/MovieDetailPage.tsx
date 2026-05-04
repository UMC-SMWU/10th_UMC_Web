import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import CastCard from "../components/CastCard";
import type { MovieDetails, MovieCredits } from "../types/movieDetail";
import useCustomFetch from "../hooks/useCustomFetch";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`;
  const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`;

  // 상세 페이지에서 커스텀 훅 사용
  const {
    data: movie,
    isPending: moviePending,
    isError: movieError,
    errorMessage: movieErrorMessage,
  } = useCustomFetch<MovieDetails>(movieUrl);

  const {
    data: credits,
    isPending: creditsPending,
    isError: creditsError,
    errorMessage: creditsErrorMessage,
  } = useCustomFetch<MovieCredits>(creditsUrl);

  if (moviePending || creditsPending) {
    return (
      <div className="flex justify-center items-center h-dvh bg-black">
        {/* 상세 페이지 로딩 처리 */}
        <LoadingSpinner />
      </div>
    );
  }

  if (movieError || creditsError || !movie || !credits) {
    return (
      <div className="flex justify-center items-center h-dvh bg-black">
        {/* 상세 페이지 에러 처리 */}
        <span className="text-red-500 text-xl text-center px-4">
          {movieErrorMessage || creditsErrorMessage || "에러가 발생했습니다."}
        </span>
      </div>
    );
  }

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "https://placehold.co/1200x500?text=No+Image";

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/300x450?text=No+Image";

  const directors = credits.crew.filter((person) => person.job === "Director");

  return (
    <div className="bg-black text-white min-h-screen px-8 py-6">
      {/* 상단 영역 */}
      <div className="relative rounded-2xl overflow-hidden min-h-95">
        <img
          src={backdrop}
          alt={`${movie.title} 배경 이미지`}
          className="w-full h-87.5 object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-0 flex gap-8 p-8">
          <img
            src={poster}
            alt={`${movie.title} 포스터`}
            className="w-52 rounded-xl shadow-xl object-cover"
          />

          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold">{movie.title}</h1>

            <p className="mt-2 text-lg">평점 {movie.vote_average.toFixed(1)}</p>
            <p>{movie.release_date}</p>
            <p>{movie.runtime ? `${movie.runtime}분` : "상영 시간 정보 없음"}</p>

            {movie.tagline && (
              <p className="italic mt-4 text-2xl text-gray-200">
                {movie.tagline}
              </p>
            )}

            <p className="mt-5 leading-7 text-gray-200">{movie.overview}</p>
          </div>
        </div>
      </div>

      {/* 감독/출연 */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-6">감독/출연</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-6">
          {directors.map((director) => (
            <CastCard
              key={`director-${director.id}`}
              imagePath={director.profile_path}
              name={director.name}
              subText={director.job}
            />
          ))}

          {credits.cast.slice(0, 15).map((actor) => (
            <CastCard
              key={`cast-${actor.id}`}
              imagePath={actor.profile_path}
              name={actor.name}
              subText={actor.character}
            />
          ))}
        </div>
      </div>
    </div>
  );
}