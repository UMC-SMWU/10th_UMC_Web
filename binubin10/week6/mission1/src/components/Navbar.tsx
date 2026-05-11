import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { accessToken } = useAuth();

  return (
    <nav className="bg-gray-900 shadow-md fixed w-full z-10">
      <div className="flex items-center justify-between p-4">
        <Link to="/" className="text-xl font-bold text-gray-900 text-white">
          SpinningSpinning Dolimpan
        </Link>
        <div className="space-x-6">
          {!accessToken && (
            <>
              <Link to={'/login'} className="text-white hover:text-blue-500">
                로그인
              </Link>
              <Link to={'/signup'} className="text-white hover:text-blue-500">
                회원가입
              </Link>
            </>
          )}
          {accessToken && (
            <Link to={'/my'} className="text-white hover:text-blue-500">
              마이 페이지
            </Link>
          )}
          <Link to={'/search'} className="text-white hover:text-blue-500">
            검색
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
