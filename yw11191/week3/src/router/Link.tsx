import React, { ReactNode } from 'react';

interface LinkProps {
  to: string;
  children: ReactNode;
}

export const Link = ({ to, children }: LinkProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // 새로고침 방지

    // 브라우저 주소창만 변경
    window.history.pushState({}, '', to);

    // 주소가 바뀌었다는 이벤트를 강제로 발생시켜 Router가 알게 함
    const navigationEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navigationEvent);
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};