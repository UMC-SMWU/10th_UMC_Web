import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Crew {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}


const MovieDetailPage = () => {
  const { movieID } = useParams();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [director, setDirector] = useState<Crew | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 영화 상세
        const movieRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieID}?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        // 출연진
        const creditRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieID}/credits?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        setMovie(movieRes.data);
        setCast(creditRes.data.cast.slice(0, 10));

        const directorData = creditRes.data.crew.find(
            (person: Crew) => person.job === "Director"
        );
        setDirector(directorData || null);
        
      } catch {
        setError("에러 발생");
      } finally {
        setLoading(false);
      }
    };

    if (movieID) fetchData();
  }, [movieID]);

  if (loading) return <div className="p-10 text-white">로딩 중...</div>;
  if (error) return <div className="p-10 text-red-400">{error}</div>;
  if (!movie) return <div className="p-10 text-white">영화 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-extrabold">{movie.title}</h1>

      <img
      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      alt={movie.title}
      className="w-60 rounded-xl my-4 shadow-lg"
      />

      <p className="mt-4 text-gray-200 leading-8">{movie.overview}</p>
      <p className="mt-4 text-yellow-400 font-semibold">⭐ {movie.vote_average.toFixed(1)}</p>
      <p className="text-gray-300">{movie.release_date}</p>
      <p className="text-gray-300">{movie.runtime}분</p>

      {director && (
        <div className="mt-6">
            <p className="mt-8 text-2xl font-bold mb-4">감독</p>
            <div className="min-w-25 text-sm">
                 <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-700">
                    {director.profile_path ? (
                        <img
                        src={`https://image.tmdb.org/t/p/w185${director.profile_path}`}
                        alt={director.name}
                        className="h-full w-full object-cover"
                        />
                    ) : (
                    <div className="flex h-full items-center justify-align text-xs text-gray-300">
                        No Image
                    </div>
                )}
                </div>
                <p className="mt-3 text-sm font-semibold">{director.name}</p>
            </div>
        </div>
    )}

      <h2 className="mt-8 text-2xl font-bold">출연</h2>
      <div className="mt-5 flex gap-6 overflow-x-auto pb-2">
        {cast.map((actor) => (
            <div key={actor.id} className="min-w-25 text-center">
                <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-gray-700">
                    {actor.profile_path ? (
                        <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        className="h-full w-full object-cover"
                        />
                    ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-300">
                        No Image
                        </div>
                    )}
                    </div>
                    
                    <p className="mt-3 text-sm font-semibold">{actor.name}</p>
                    <p className="text-xs text-gray-400">{actor.character}</p>
                </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetailPage;