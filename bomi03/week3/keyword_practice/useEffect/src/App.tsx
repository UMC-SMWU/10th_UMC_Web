// import { useEffect, useState } from 'react';
// import type {Movie, MovieResponse } from './types/movie';
// import axios from 'axios';

// const MoviesPage = () => {
//   const [movies, setMovies] = useState<Movie[]>([]);

//   useEffect(() => {
//     const fetchMovies = async () => {
//       const { data } = await axios.get<MovieResponse>(
//         'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
//         {
//           headers: {
//             Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmODViYWM4OTE5ZmEyN2FlYzM2Njk0NGE3NDg1OGI0OSIsIm5iZiI6MTc3NTMxNjMxOC4xMTAwMDAxLCJzdWIiOiI2OWQxMmQ1ZTA4MDA4NDhkNjBiMmVkMDMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.p2EAQt9l301qYhdtEnCB8xpbu4mNjtTcCM4jTFbib58`, // 본인 TMDB 토큰으로 교체
//           },
//         }
//       );
//       setMovies(data.results);
//     };

//     fetchMovies();
//   }, []);

//   console.log(movies); // 영화 데이터 체크

//   return (
//     <ul>
//       {/* 옵셔널 체인 활용 */}
//       {movies?.map((movie) => (
//         <li key={movie.id}>
//           <h1>{movie.title}</h1>
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default MoviesPage;



// useEffect 심화 - 클린업 함수 기본 예제 (따로 프로젝트 생성하지 않고 이어서 작성 후 실습)
import { useEffect, useState } from "react";

const SearchPage = () => {
  const [counter, setCounter] = useState(0);

  const handleClick = () => {
    setCounter((prev) => prev + 1);
  };

  useEffect(() => {
    const mouseClickEffectEvent = () => {
      console.log(counter);
    };

    window.addEventListener("click", mouseClickEffectEvent);

    // 클린업 함수
    return () => {
      console.log("클린업 함수 실행!", counter);
      window.removeEventListener("click", mouseClickEffectEvent);
    };
  }, [counter]);

  return (
    <>
      <h1 style={{ color: "white" }}>{counter}</h1>
      <button onClick={handleClick}>+</button>
    </>
  );
};

export default SearchPage;