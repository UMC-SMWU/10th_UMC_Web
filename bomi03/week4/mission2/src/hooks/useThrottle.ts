// useThrottle: 주어진 값(상태)이 자주 변경되면
// 최소 interval(밀리초) 간격으로만 업데이트해서 성능을 개선한다.

import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value: T, interval: number = 500) {
  // 1. 상태 변수: throttledValue는 최종적으로 쓰로틀링이 적용된 값이다.
  // 초기값은 전달받은 value로 설정한다.
  const [throttledValue, setThrottledValue] = useState<T>(value);

  // 2. lastExecuted는 마지막으로 업데이트된 시간을 기록하는 변수다.
  // useRef를 사용하면 컴포넌트가 리렌더링되어도 값이 유지되고, 값이 바뀌어도 리렌더링을 발생시키지 않는다.
  const lastExecuted = useRef<number>(0);

  // 3. value 또는 interval이 변경될 때마다 실행된다.
  useEffect(() => {
    const now = Date.now();
    const elapsedTime = now - lastExecuted.current;

    // 처음 실행이거나 interval 시간이 지났다면 바로 다음 타이머에서 업데이트하고,
    // 아직 interval 시간이 지나지 않았다면 남은 시간만큼 기다린 뒤 업데이트한다.
    const remainingTime =
      lastExecuted.current === 0 || elapsedTime >= interval
        ? 0
        : interval - elapsedTime;

    const timerId = setTimeout(() => {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    }, remainingTime);

    // CleanUp Function: 이펙트가 재실행되거나 컴포넌트가 언마운트되기 전에
    // 기존 타이머를 clearTimeout으로 정리하여 중복 업데이트를 방지한다.
    return () => clearTimeout(timerId);
  }, [value, interval]);

  return throttledValue;
}

export default useThrottle;
