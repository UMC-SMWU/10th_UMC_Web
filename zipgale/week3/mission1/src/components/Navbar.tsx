import { NavLink } from "react-router-dom"

const Links = [
  {to: '/', label: '홈'},
  {to: 'movies/popular', label: '인기 영화'},
  {to: 'movies/now_playing', label: '상영중'},
  {to: 'movies/top_rated', label: '평점 높은 영화'},
  {to: 'movies/upcoming', label: '개봉 예정 영화'},
]
export const Navbar = () => {
  return (
  <div className='flex gap-3 p-4'>
    {Links.map(({to, label}) => ( // NavLInk : className에서 현재 경로 반환
      <NavLink
        key={to}
        to={to}
        className={({isActive}) => { // 현재 경로일때 아래색상
          return isActive ? 'text-[#b2dab1] font-bold' : 'text-gray-500'
        }}
        >
          {label}
        </NavLink>
    ))}
  </div>
  )
}