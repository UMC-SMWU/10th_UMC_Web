import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Aside = () => {
  const { accessToken } = useAuth();
  return (
    <aside className="bg-gray-900 shadow-md-fixed h-full z-10">
      <div className="flex flex-column items-center p-4">
        {!accessToken && ( // accessToken이 없을 때
            <>
              <p>로그인 해주세요</p>
            </>
          )}
        {accessToken && (
            <>
              <Link to={"/my"}>마이 페이지</Link>
              <Link
                to={"/search"}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              >
                검색
              </Link>
            </>
          )}
      </div>
    </aside>
  );
};

export default Aside;
