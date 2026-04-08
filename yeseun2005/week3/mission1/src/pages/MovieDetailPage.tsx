import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

const MovieDetailPage = () => {
  const { movieID } = useParams();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
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
        setCast(creditRes.data.cast.slice(0, 5));
      } catch {
        setError("에러 발생");
      } finally {
        setLoading(false);
      }
    };

    if (movieID) fetchData();
  }, [movieID]);

  // 로딩
  if (loading) return <div>로딩중...</div>;

  // 에러
  if (error) return <div>{error}</div>;

  // 데이터 없음
  if (!movie) return <div>데이터 없음</div>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">{movie.title}</h1>

      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        className="w-60 my-3"
      />

      <p>{movie.overview}</p>
      <p>⭐ {movie.vote_average}</p>
      <p>{movie.release_date}</p>
      <p>{movie.runtime}분</p>

      {/* 출연진 */}
      <h2 className="mt-5 text-xl font-semibold">출연진</h2>
      <div className="flex gap-4">
        {cast.map((actor) => (
          <div key={actor.id}>
            <p>{actor.name}</p>
            <p className="text-sm text-gray-400">{actor.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetailPage;