import { useState, useEffect } from "react";

export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 시간 뒤에 value를 debouncedValue로 업데이트하는 타이머 설정
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 핵심: value나 delay가 바뀌면(사용자가 계속 타이핑 중이면) 
    // 이전 타이머를 취소해서 실행되지 않게 막음
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};