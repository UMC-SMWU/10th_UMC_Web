import { useEffect, useState } from "react";

const useThrottle = <T>(value: T, interval: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setThrottledValue(value);
    }, interval);

    return () => {
      clearTimeout(timer);
    };
  }, [value, interval]);

  return throttledValue;
};

export default useThrottle;