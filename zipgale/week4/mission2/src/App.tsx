import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import HomeLayout from './layouts/HomeLayout'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'

// 1. 홈페이지
// 2. 로그인 페이지
// 3. 회원가입 페이지

const router = createBrowserRouter([
  {
    path: "/",
    element : <HomeLayout />, // element: 공유되는 레이아웃들을 표시
    children: [
      {
        index: true, // == path: '/'
        element: <HomePage />
      },
      {
      path: 'login',
      element: <LoginPage />
      },
      {
        path: 'signup',
        element: <SignupPage />
      }
    ] // children: 변화되는 요소
  }
])
function App() {

  return (
    <RouterProvider router = {router} />
  )
}

export default App
