import { useState, useEffect } from 'react';

export const useCurrentPath = () => {
  // 1. 현재 경로를 초기 상태로 설정
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    // 2. 주소가 바뀌었을 때 실행할 함수
    const handler = () => {
      setPath(window.location.pathname);
    };

    // 3. 브라우저의 popstate 이벤트(뒤로가기/앞으로가기/dispatchEvent) 감시 시작
    window.addEventListener('popstate', handler);

    // 4. 컴포넌트가 사라질 때 감시 종료 (메모리 누수 방지)
    return () => {
      window.removeEventListener('popstate', handler);
    };
  }, []);

  return path;
};