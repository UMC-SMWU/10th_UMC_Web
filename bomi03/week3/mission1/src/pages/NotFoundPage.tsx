import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-500">페이지를 찾을 수 없습니다.</p>
      <Link
        to="/movies/popular"
        className="px-4 py-2 rounded-lg bg-[#b2dab1] text-white"
      >
        영화 페이지로 돌아가기
      </Link>
    </div>
  );
};

export default NotFoundPage;