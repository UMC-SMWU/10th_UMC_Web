import { useParams } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useCustomFetch } from '../hooks/useCustomFetch';
import type { MovieDetail, CreditsResponse } from '../types/movie';

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  // 영화 상세 정보 호출
  const {
    data: movie,
    isPending: isMovieLoading,
    isError: isMovieError,
  } = useCustomFetch<MovieDetail>(
    movieId
      ? `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`
      : '',
    {
      headers: { Authorization: `Bearer ${API_KEY}` },
    },
    [movieId],
  );

  // 출연진/제작진 호출
  const {
    data: credits,
    isPending: isCreditsLoading,
    isError: isCreditsError,
  } = useCustomFetch<CreditsResponse>(
    movieId
      ? `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`
      : '',
    {
      headers: { Authorization: `Bearer ${API_KEY}` },
    },
    [movieId],
  );

  const loading = isMovieLoading || isCreditsLoading;
  const error = isMovieError || isCreditsError;

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );

  if (error) return <p>❌ 데이터를 불러오는 중 오류가 발생했습니다.</p>;
  if (!movie) return <p>❌ 영화 정보를 불러올 수 없습니다.</p>;

  const cast = credits?.cast ?? [];
  const crew = credits?.crew ?? [];

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
}
