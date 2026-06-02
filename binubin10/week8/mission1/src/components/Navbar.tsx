import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { getMyInfo } from '../apis/auth';

const Navbar = () => {
  const { accessToken, logout } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      if (accessToken) {
        try {
          const response = await getMyInfo();
          if (response && response.data) {
            setUserName(response.data.name);
          }
        } catch (error) {
          console.error('유저 정보 로드 실패', error);
        }
      } else {
        setUserName(null);
      }
    };
    fetchUserName();
  }, [accessToken]);

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
            <>
              <span className="text-white text-sm">
                🔍{userName || '사용자'}님 반갑습니다.
              </span>
              <button
                onClick={logout}
                className="text-white hover:text-blue-500"
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
