import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import HomeLayout from './layouts/HomeLayout'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/MyPage'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedLayout from './layouts/ProtectedLayout'
import NotFoundPage from './pages/NotFoundPage'
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/production'
import LpDetailPage from './pages/LpDetailPage'
import ThrottlePage from './pages/ThrottlePage'

// 1. 홈페이지
// 2. 로그인 페이지
// 3. 회원가입 페이지

// publicRouter 인증 없이 접근 가능한 라우트
const publicRoutes:RouteObject[] = [
  { path:'/',
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
      },
      {
        path: 'v1/auth/google/callback',
        element: <GoogleLoginRedirectPage />
      },
      {path: 'lps/:lpId',element:<LpDetailPage/>},
      {path: '/throttle', element:<ThrottlePage/>}
    ] // children: 변화되는 요소
  }
];

// protectedRoutes 인증이 필요한 라우트
const protectedRoutes: RouteObject[] = [
  {
    path:'/',
    element: <ProtectedLayout />, // element: 공유되는 레이아웃들을 표시
    errorElement: <NotFoundPage />, // errorElement: 라우트 매칭 실패 시 보여줄 컴포넌트  
    children: [
      {
        path: 'my',
        element: <MyPage />
      }
    ]
  }
]

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]) // children: 변화되는 요소

export const queryClient = new QueryClient(
  {
    defaultOptions: {
      queries: {
        retry: 3
      }
    }
  }
);

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router = {router} />
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />} {/* 개발 환경에서만 React Query Devtools 표시*/}
    </QueryClientProvider>
  )
}

export default App
