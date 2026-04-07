import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { type MovieDetails, type Cast, type MovieCreditsResponse } from '../types/movie';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const MovieDetailPage = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [cast, setCast] = useState<Cast[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchMovieData = async () => {
            setIsLoading(true);
            try {
                // 1. 영화 상세 정보 가져오기
                const detailRes = await axios.get<MovieDetails>(
                    `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
                    { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` } }
                );
                // 2. 출연진 정보 가져오기
                const creditsRes = await axios.get<MovieCreditsResponse>(
                    `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
                    { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` } }
                );

                setMovie(detailRes.data);
                setCast(creditsRes.data.cast);
            } catch {
                setIsError(true); // 에러 상태를 true로 변경
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieData();
    }, [movieId]);

    if (isLoading) return <div className="h-screen flex justify-center items-center"><LoadingSpinner /></div>;
    if (!movie) return <div className="text-white text-center mt-10">영화 정보를 찾을 수 없습니다.</div>;
    if (isError) return (
    <div className="h-screen flex flex-col justify-center items-center text-white">
        <h2 className="text-2xl font-bold mb-4 text-red-600">영화를 불러오는 중 문제가 발생했습니다.</h2>
        <button onClick={() => window.location.reload()} className="bg-[#b2dab1] p-2 rounded text-black">다시 시도</button>
    </div>
);

    return (
        <div className="w-full text-white bg-[#090909]">
            {/* 배경 이미지 */}
            <div className="relative w-full h-[500px] overflow-hidden">
                <img 
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
                    alt="background" 
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090909] to-transparent" />
                
                {/* 정보 레이아웃 */}
                <div className="absolute inset-0 flex flex-col md:flex-row items-start justify-between px-10 md:px-20 gap-10 mt-60">
                    <div className="flex-1 space-y-4">
                        <h1 className="text-4xl font-extrabold">{movie.title}</h1>
                        <div className="flex items-center gap-4 text-lg text-left font-medium">
                            <span>평점: ⭐ {movie.vote_average.toFixed(1)}</span>
                            <span>{movie.release_date.split('-')[0]}</span>
                            <span>{movie.runtime}분</span>
                        </div>
                        <p className="text-xl font-light text-gray-300">{movie.tagline}</p>
                    </div>
                    
                    {/* Overview */}
                    <div className="flex-1 rounded-xl max-w-lg text-right">
                        <h3 className="text-xl font-bold mb-3">줄거리</h3>
                        <p className="text-sm text-justify leading-relaxed line-clamp-6 text-gray-300">{movie.overview || "설명이 없습니다."}</p>
                    </div>
                </div>
            </div>

            {/* 출연진 */}
            <div className="px-10 md:px-20 py-10">
                <h2 className="text-2xl font-bold mb-8">감독/출연</h2>
                <div className="w-full flex flex-wrap gap-10 pb-6">
                    {cast.slice(0, 18).map((person, idx) => ( // 18명만 표시
                        <div key={idx} className="w-24 text-center space-y-2">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700 mx-auto">
                                <img 
                                    src={person.profile_path 
                                        ? `https://image.tmdb.org/t/p/w200${person.profile_path}` 
                                        : 'https://placehold.co/200x200?text=No Image'} // 자동으로 이미지 만들어주는 사이트
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-xs font-bold truncate">{person.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">{person.character}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
