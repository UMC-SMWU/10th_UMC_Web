import { useEffect, useState } from 'react';
import './App.css';

// 각 경로에 해당하는 페이지 컴포넌트 정의
function HomePage() {
  return <h1>Home Page</h1>;
}

function AboutPage() {
  return <h1>About Page</h1>;
}

function ContactPage() {
  return <h1>Contact Page</h1>;
}

// 정의되지 않은 경로에 대한 404 페이지
function NotFoundPage() {
  return <h1>404 Not Found</h1>;
}

function App() {
  // 현재 URL 경로를 상태로 관리
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    // 뒤로가기 / 앞으로가기 버튼 클릭 시 실행되는 함수
    const handlePopState = () => {
      // 현재 URL을 다시 읽어서 상태 업데이트
      setPath(window.location.pathname);
    };
    
    // popstate 이벤트 등록
    window.addEventListener('popstate', handlePopState);
  }, []);

  // 페이지 이동 함수
  const navigate = (to: string) => {
    // History API를 사용하여 URL 변경 (새로고침 없음)
    window.history.pushState({}, '', to);
    // 상태를 변경하여 컴포넌트 다시 렌더링
    setPath(to);
  };

  // 현재 경로에 따라 다른 컴포넌트를 렌더링
  const renderPage = () => {
    switch (path) {
      case '/':
        return <HomePage />;
      case '/about':
        return <AboutPage />;
      case '/contact':
        return <ContactPage />;
      default:
        // 정의되지 않은 경로일 경우 404 페이지 출력
        return <NotFoundPage />;
    }
  };

  // 버튼 클릭 시 navigate 함수 실행 → URL 변경 + 화면 업데이트
  return (
    <div className="container">
      <nav className="nav">
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate('/about')}>About</button>
        <button onClick={() => navigate('/contact')}>Contact</button>
      </nav>

      <main className="main">{renderPage()}</main>
    </div>
  );
}

export default App;