import { useParams, Link } from "react-router-dom";

function MovieDetail() {
  const { movieId } = useParams();

  return (
    <main className="container">
      <h1>영화 상세 페이지</h1>
      <p>movieId: {movieId}</p>

      <Link to="/">메인으로 돌아가기</Link>
    </main>
  );
}

export default MovieDetail;