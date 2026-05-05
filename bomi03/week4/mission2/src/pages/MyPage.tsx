import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      console.log(response);

      setData(response);
    };

    getData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!data) {
    return <div>사용자 정보를 불러오는 중입니다.</div>;
  }

  console.log("내 정보:", data);
  console.log("avatar:", data.data.avatar);

  return (
    <div>
      <h1>{data.data?.name}님 환영합니다!</h1>
      {data.data.avatar ? (
        <img src={data.data.avatar} alt="프로필 이미지" />
      ) : (
        <p>프로필 이미지가 없습니다.</p>
      )}
      <h1>{data.data?.email}</h1>

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
