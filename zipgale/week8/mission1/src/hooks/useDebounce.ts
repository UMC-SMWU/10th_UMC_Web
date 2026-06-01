
// 상태, timer 받아오기
// debounce된 value값 return

import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay:number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // value 또는 delay가 변경될 때 마다 실행
  useEffect(() => {
    // delay 시간 후에 value를 devouncedValue로 업데이트하는 타이머를 시작.4

    const handler = setTimeout(() => setDebouncedValue(value), delay)

    // value가 변경되면, 기존 타이며를 지워서 업데이트를 취소함. - 클린업 함수
    // 값이 계속 바뀔 때마다 마지막에 값만 업데이터 됨.

    return () => clearTimeout(handler);
  }, [value, delay]);

  // 최종적으로 잠시 기다린 후의 값을 반환함.
  return debouncedValue;
}

export default useDebounce;