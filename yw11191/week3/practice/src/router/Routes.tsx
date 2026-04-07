import React, { useState, useEffect, ReactNode } from 'react';
import { useCurrentPath } from '../hooks/useCurrentPath';

export const Routes = ({ children }: { children: ReactNode }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    // 브라우저의 뒤로가기/앞으로가기 및 pushState 신호 감시
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const element = React.Children.toArray(children).find((child) => {
      if (React.isValidElement(child)) {
        // Route 컴포넌트가 가진 path 속성과 현재 주소를 비교합니다.
        return child.props.path === currentPath;
      }
      return false;
    });

    // 찾은 녀석(element)만 보여주고, 없으면 null(혹은 404)을 보여줍니다.
    return <>{element || <h1>404 Not Found</h1>}</>;
  };