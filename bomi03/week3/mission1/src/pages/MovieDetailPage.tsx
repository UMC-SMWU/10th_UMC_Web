import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import CastCard from "../components/CastCard";
import type {
  MovieDetails,
  MovieCredits,
} from "../types/movieDetail";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>(); // movie/:movieId에서 movieId 가져옴

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<MovieCredits | null>(null);

  // 로딩 및 에러 상태 관리
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!movieId) return;

      setIsPending(true); // API 요청 시작 전에 로딩 상태를 true로 설정
      setIsError(false); // 에러 상태 초기화

      try {
        const [movieRes, creditRes] = await Promise.all([
          axios.get<MovieDetails>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
          axios.get<MovieCredits>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
        ]);

        setMovie(movieRes.data); // 상세 정보 데이터를 상태에 저장
        setCredits(creditRes.data); // credits 데이터를 상태에 저장
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, [movieId]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !movie || !credits) {
    return (
      <div className="flex justify-center items-center h-dvh">
        <span className="text-red-500 text-xl">
          에러가 발생했습니다.
        </span>
      </div>
    );
  }

  // TMDB 이미지 경로를 실제 이미지 URL로 변환
  const backdrop = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  // crew 배열에서 감독만 필터링
  const directors = credits.crew.filter(
    (p) => p.job === "Director"
  );

  return (
    <div className="bg-black text-white min-h-screen px-8 py-6">
      {/* 상단 */}
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src={backdrop}
          className="w-full h-[350px] object-cover"
        />
        
        {/* 배경 이미지 위에 반투명 오버레이 추가 */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex gap-8 p-8">
          {/* 영화 포스터 */}
          <img src={poster} className="w-52 rounded-xl" />

          <div>
            {/* 영화 제목 */}
            <h1 className="text-4xl font-bold">{movie.title}</h1>

            {/* 영화 평점 */}
            <p className="mt-2">⭐ {movie.vote_average}</p>

            {/* 개봉일 */}
            <p>{movie.release_date}</p>

            {/* 상영 시간 */}
            <p>{movie.runtime}분</p>

            {movie.tagline && (
              <p className="italic mt-3 text-xl">
                {movie.tagline}
              </p>
            )}

            {/* 영화 줄거리 */}
            <p className="mt-4">{movie.overview}</p>
          </div>
        </div>
      </div>

      {/* 하단 영역: 출연진 */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-6">감독/출연</h2>

        <div className="grid grid-cols-10 gap-4"> {/* 한 줄에 최대 10개의 프로필이 보이도록 배치 */}
          {/* 감독 목록 출력 */}
          {directors.map((d) => (
            <CastCard
              key={d.id}
              imagePath={d.profile_path}
              name={d.name}
              subText={d.job}
            />
          ))}

          {/* 출연진 목록 출력 - 너무 많을 수 있으므로 상위 15명만 표시 */}
          {credits.cast.slice(0, 15).map((actor) => (
            <CastCard
              key={actor.id}
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