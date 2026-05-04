import { useEffect, useState } from 'react';
import { getMyInfo } from '../apis/auth';
import { useAuth } from '../context/AuthContext';
import type { ResponseMyInfoDto } from '../types/auth';
import defaultAvatar from '../assets/default-avatar.png';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto['data'] | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyInfo();
        console.log('알맹이 데이터:', response.data);

        if (response && response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error('데이터 가져오기 에러:', error);
      }
    };
    getData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div>
      <h1>{data?.name}님 환영합니다.</h1>
      <img
        src={data?.avatar || defaultAvatar}
        alt="프로필"
        style={{
          width: '200px',
          height: '200px',
          objectFit: 'cover',
        }}
      />{' '}
      <h1>{data?.email}</h1>
      <button
        className="cursor-pointer bg-blue-300 rounded-sm p-5 hover:scale-90"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;
