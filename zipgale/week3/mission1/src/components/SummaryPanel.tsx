import type { MovieDetail } from "../types/movie"

interface SummaryPanelProps {
  movieDetail: MovieDetail
}

function SummaryPanel({movieDetail}: SummaryPanelProps) {
  return (
    //<div className='bg-[url(`https://image.tmdb.org/t/p/original/${movieDetail.poster_path}`)]' >
    <div 
      className='relative'
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original/${movieDetail.poster_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      >
      <div className='absolute inset-0 bg-linear-to-r from-black to-transparent'></div>
      <div className='relative flex flex-col gap-4 p-9 text-white z-10'>
        <h1 className='text-3xl font-bold'>{movieDetail.title}</h1> {/* 영화 제목 */}
        <div className='flex gap-2 flex-col text-xl'>
          <p>{movieDetail.vote_average.toFixed(1)}/10</p> {/* 영화 평점 */}
          <p className=''>{movieDetail.release_date}</p> {/* 영화 개봉일 */}
          <p>{movieDetail.runtime} min</p> {/* 영화 러닝타임 */}
        </div>
        <div className='w-1/3  text-xl'>
          <p className="leading-relaxed mt-2 line-clamp-5 italic">{movieDetail.overview}</p> {/* 영화 개요 */}
        </div>
        <div className='pb-4'></div>
      </div>
    </div>
  )
}

export default SummaryPanel
