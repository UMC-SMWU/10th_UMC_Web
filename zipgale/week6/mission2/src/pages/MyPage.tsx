import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth"
import { useAuth } from "../contexts/AuthContext";
const MyPage = () => {
  const {logout} = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto>();
  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      console.log(response)

      setData(response);
    };

    getData();
  },[])

  const handleLogout = async() => {
    await logout();
  }

  return (
  <div>
    <h1>{data?.data.name}님 환영합니다</h1>
    <img src={data?.data.avatar as string} alt="구글로고" />
    <button className = 'cursor-pointer bg-blue-300 rounded-sm p-5 hover:scale-90'onClick={handleLogout}>Logout</button>
  </div>)
};

export default MyPage;