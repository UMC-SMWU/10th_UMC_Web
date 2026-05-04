import { useEffect, useState } from 'react';
import { getMyInfo } from '../apis/auth';
import { useAuth } from '../context/AuthContext';
import type { ResponseMyInfoDto } from '../types/auth';

const MyPage = () => {
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
  };

  return (
    <div>
      <h1>{data?.name}님 환영합니다.</h1>
    </div>
  );
};

export default MyPage;
