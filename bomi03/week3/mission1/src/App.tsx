import "./App.css";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import MovieDetailPage from "./pages/MovieDetailPage";

// createBrowserRouter v6 로 설명

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      // 홈으로 들어오면 인기 영화 페이지로 이동
      {
        index: true,
        element: <Navigate to="/movies/popular" replace />,
      },
      {
        path: "/movies/:category", // 동적으로 category 받아올 수 있게 처리
        element: <MoviePage />,
      },
      {
        path: "movie/:movieId",
        element: <MovieDetailPage />,
      },
    ],
  },
]);


function App() {
  return <RouterProvider router={router} />;
}

export default App;