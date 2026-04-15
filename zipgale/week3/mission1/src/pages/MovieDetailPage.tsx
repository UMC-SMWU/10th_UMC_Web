import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import type { MovieCastResponse, MovieDetail } from "../types/movie";
import SummaryPanel from "../components/SummaryPanel";
import { CastCard } from "../components/CastCard";
import { useCustomFetch } from "../hooks/useCustomFetch";

export default function MovieDetailPage() {
  const {id} = useParams<{
      id: string;
    }>();

  const {data: movieDetail, isPending: isMovieLoading, isError: isMovieError} = useCustomFetch<MovieDetail>(
    id
    ? `https://api.themoviedb.org/3/movie/${id}?language=ko-KR`
    : "",
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
      },
    },
    [id]
  );

  const {data: credits, isPending: isCreditsLoading, isError: isCreditsError } = useCustomFetch<MovieCastResponse>(
    id 
    ? `https://api.themoviedb.org/3/movie/${id}/credits?language=ko-KR`
    : "",
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
      },
    },
    [id]
  )

  const loading = isMovieLoading || isCreditsLoading;
  const error = isMovieError || isCreditsError;
  
  if(loading)
    return (
      <div className="flex items-center justify-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  if(error)
    return (
      <div>
        <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
      </div>
  );
  if(!movieDetail)
    return (
      <p>❌ 영화 정보를 불러올 수 없습니다.</p>
  );

  const casts = credits?.cast ?? [];

  return (
    <>
      {movieDetail && (
        <div>
          <SummaryPanel movieDetail={movieDetail} />
          <div className=' bg-black'>
            <h1 className='text-white text-3xl font-bold p-10'>감독/출연</h1>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-10'>
            {casts?.map((cast) => {
              return <CastCard key={cast.cast_id} cast={cast} />;
            })}
          </div>
          </div>
        </div>
      )}
    </>
  )
}
