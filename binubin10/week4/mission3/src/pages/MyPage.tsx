import { useEffect, useState } from 'react';
import { getMyInfo } from '../apis/auth';

// 데이터 모양 정의
interface UserData {
  name: string;
  email: string;
}

const MyPage = () => {
  const [data, setData] = useState<UserData | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyInfo();
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);

  if (!data) {
    return <div>로딩 중...</div>;
  }

  console.log(data.name);
  return <div>{data.name}</div>;
};

export default MyPage;
