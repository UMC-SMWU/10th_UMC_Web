import { useEffect, useState } from "react";
import axios from "axios";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import type { MovieCast, MovieCastResponse, MovieDetail } from "../types/movie";
import SummaryPanel from "../components/SummaryPanel";
import { CastCard } from "../components/CastCard";

export default function MovieDetailPage() {
  const [movieDetail, setMovieDetail] = useState<MovieDetail>();
  const [casts, setCasts] = useState<MovieCast []>();
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const {id} = useParams<{
      id: string;
    }>();

  useEffect(() => {
      const fetchMovie = async () => {
        setIsPending(true);
        try {
          const {data} = await axios.get<MovieDetail>( 
            `https://api.themoviedb.org/3/movie/${id}?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            },
          );
          const {data : castData} = await axios.get<MovieCastResponse>(
            `https://api.themoviedb.org/3/movie/${id}/credits?language=ko-KR`,{
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          );
          setMovieDetail(data);
          setCasts(castData.cast);
        } catch {
          setIsError(true); // 에러 발생
        } finally {
          setIsPending(false); // 로딩 끝
        }
    };
    fetchMovie();
  }, [id]);

  if (isError) {
      return (
        <div>
          <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
        </div>
      );
    }

  return (
    <>
      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}
      {!isPending && movieDetail && (
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
