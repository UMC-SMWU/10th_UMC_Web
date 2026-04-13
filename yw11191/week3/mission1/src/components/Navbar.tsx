const LINKS = [
    {to:'/', label:'홈'},
    {to:'/movies/popular', label:'인기 영화'},
    {to:'/movies/now_playing', label:'상영 중'},
    {to:'/movies/top_rated', label:'평점 높은'},
    {to:'/movies/upcoming', label:'개봉 예정'},
]

import { NavLink, useNavigate, useLocation } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로를 가져오기

  // 회원가입 또는 로그인 페이지인지 확인
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  // 1. 회원가입/로그인 페이지용
  if (isAuthPage) {
    return (
      <header className="flex items-center justify-between p-4 bg-black border-b border-gray-800">
        <h1 
          onClick={() => navigate('/')} 
          className="text-xl font-bold text-[#FF007F] cursor-pointer"
        >
          ywMOVIE
        </h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-white hover:text-gray-300 text-sm"
          >
            로그인
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="bg-[#FF007F] text-white px-4 py-2 rounded-lg font-medium hover:bg-pink-700 text-sm"
          >
            회원가입
          </button>
        </div>
      </header>
    );
  }

  // 2. 일반 영화 페이지용
  return (
    <nav className="flex items-center justify-between p-4 bg-[#141414] text-white">
      <h1 
        onClick={() => navigate('/')} 
        className="text-xl font-bold text-[#FF007F] cursor-pointer"
      >
        ywMOVIE
      </h1>
        <div className='flex gap-3 p-4'>
            {LINKS.map(({to, label}) => (
                <NavLink key={to} to={to} className={({isActive}) => {
                    return isActive ? 'text-[#b2dab1] font-bold' : 'text-gray-500';
                }}>
                    {label}
                </NavLink>
            ))}
        </div>
      <div className="flex gap-4">
          <button onClick={() => navigate('/login')} className="hover:text-gray-300">로그인</button>
          <button onClick={() => navigate('/signup')} className="bg-[#FF007F] px-3 py-1 rounded">회원가입</button>
      </div>
    </nav>
  );
};

