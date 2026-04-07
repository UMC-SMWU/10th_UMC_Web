import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { MovieDetail, CreditsResponse } from '../types/movie';
import { LoadingSpinner } from '../components/LoadingSpinner';

const MovieDetailPage = () => {
  // 1. URL 파라미터에서 movieID 추출
  const { movieID } = useParams<{ movieID: string }>();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<CreditsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        // 2. 상세 정보와 출연진 정보를 병렬로 동시에 요청
        const [detailRes, creditsRes] = await Promise.all([
          axios.get<MovieDetail>(
            `https://api.themoviedb.org/3/movie/${movieID}?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            },
          ),
          axios.get<CreditsResponse>(
            `https://api.themoviedb.org/3/movie/${movieID}/credits?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            },
          ),
        ]);

        setMovie(detailRes.data);
        setCredits(creditsRes.data);
      } catch (error) {
        console.error('데이터 호출 에러:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (movieID) fetchMovieData();
  }, [movieID]);

  // 에러 발생 시 UI
  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <p className="text-2xl">데이터를 불러오는 중 에러가 발생했습니다.</p>
      </div>
    );
  }

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* 3. 상단 히어로 섹션 (배경 포스터 및 요약 정보) */}
      <div
        className="relative h-[500px] w-full bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.2) 100%), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="flex flex-col justify-center h-full px-10 md:px-20 max-w-6xl">
          <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>

          <div className="flex items-center gap-4 text-lg mb-6 text-gray-300">
            <span className="text-yellow-400 font-bold">
              평점 {movie.vote_average.toFixed(1)}
            </span>
            <span>{movie.release_date.split('-')[0]}</span>
            <span>{movie.runtime}분</span>
          </div>

          {movie.tagline && (
            <p className="text-2xl italic text-gray-400 mb-6">
              "{movie.tagline}"
            </p>
          )}

          <p className="text-lg leading-relaxed text-gray-200 max-w-3xl line-clamp-6">
            {movie.overview || '등록된 줄거리가 없습니다.'}
          </p>
        </div>
      </div>

      {/* 4. 감독/출연 섹션 */}
      <div className="px-10 md:px-20 py-12">
        <h2 className="text-3xl font-bold mb-10">감독/출연</h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-8">
          {credits?.cast.slice(0, 20).map((person) => (
            <div key={person.id} className="flex flex-col items-center group">
              {/* 프로필 이미지 (원형) */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-800 group-hover:border-gray-500 transition-colors duration-300 aspect-square">
                <img
                  src={
                    person.profile_path
                      ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                      : 'https://via.placeholder.com/200x200?text=No+Image'
                  }
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 이름 및 배역 */}
              <div className="mt-3 text-center w-full">
                <p className="text-sm font-bold truncate px-1">{person.name}</p>
                <p className="text-[11px] text-gray-500 truncate px-1 mt-1">
                  {person.character} 역
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
