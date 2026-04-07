import React, { ReactElement } from 'react';

interface RouteProps {
  path: string;
  component: ReactElement;
}

export const Route = ({ path, component }: RouteProps) => {
  const currentPath = window.location.pathname;

  // 주소가 일치하면 컴포넌트 반환, 아니면 아무것도 안 보여줌
  return currentPath === path ? component : null;
};