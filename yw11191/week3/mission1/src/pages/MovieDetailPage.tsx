import { useParams } from 'react-router-dom';
import { type MovieDetails, type MovieCreditsResponse } from '../types/movie';
import { LoadingSpinner } from '../components/LoadingSpinner';
import useCustomFetch from '../hooks/useCustomFetch';

export const MovieDetailPage = () => {
    const { movieId } = useParams();
    const {data:movie, isPending:isMoviePending, isError:isMovieError} = useCustomFetch<MovieDetails>(`/movie/${movieId}?language=ko-KR`);
    const {data:credits, isPending:isCreditsPending, isError:isCreditsError} = useCustomFetch<MovieCreditsResponse>(`/movie/${movieId}/credits?language=ko-KR`);

    if (isMoviePending || isCreditsPending) {
        return <div className="h-screen flex justify-center items-center"><LoadingSpinner /></div>;
    }

    if (isMovieError || isCreditsError){
        return <div className="text-white text-center mt-10 text-2xl">정보를 불러오지 못했습니다.</div>;
    }

    if (!movie) return null;

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
                    {credits?.cast.slice(0, 18).map((person, idx) => ( // 18명만 표시
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
