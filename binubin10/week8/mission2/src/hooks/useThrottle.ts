// useThrottle: 주어진 값(상태)가 자주 변경될 때
// 최소 interval(밀리초) 간격으로만 업데이트 해서 성능을 개선한다.

import { useEffect, useRef, useState } from 'react';

function useThrottle<T>(value: T, delay = 500): T {
  // 1. 상태 변수: throttledValue: 최종적으로 쓰로틀링이 적용된 값 저장.
  // 초기값을 전달받은 value
  const [throttledValue, setThrottledValue] = useState<T>(value);
  // 2. Ref lastExcecuted: 마지막으로 실행된 시간을 기록하는 변수
  // useRef 사용하면 컴포넌트가 리렌더링 되어도 값이 유지되고, 변경되어도 리렌더링을 트리거하지 않아요.
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();

    if (now >= lastExecuted.current + delay) {
      // 1. 즉시 업데이트 경로
      lastExecuted.current = now;
      setThrottledValue(value);
    } else {
      // 2. 타이머 대기 경로
      const timeDiff = lastExecuted.current + delay - now; // 남은 시간만큼만 대기하도록 최적화 가능

      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, timeDiff);

      return () => clearTimeout(timerId);
    }
  }, [value, delay]);

  return throttledValue;
}

export default useThrottle;
