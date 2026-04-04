import './App.css'

// 1. React Router에서 필요한 함수/컴포넌트를 import
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 방법 2) 404 페이지 컴포넌트
const NotFound = () => (
  <main style={{ padding: 24 }}>
    <h1>페이지를 찾을 수 없어요 (404)</h1>
    <p>주소를 다시 확인하거나 홈으로 이동해 주세요.</p>
    <a href="/">홈으로</a>
  </main>
);

// 2. 경로(path)와 보여줄 화면(element)를 정의
const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>홈 페이지입니다.</h1>,
    // 매칭 실패/라우트 에러 시 보여줄 UI
    errorElement: <h1>너는 없는 경로에 들어왔다 ^ㅁ^ 야호~!</h1>, // 방법 1)
  },
  {
    path: '/movies',
    element: <h1>영화 페이지 입니다.</h1>
  },
  { 
    path: '*', 
    element: <NotFound /> 
  }, // 가장 마지막에 배치
]);

// 3. RouterProvider로 router 전달
function App() {
  return <RouterProvider router={router} />
}

export default App;