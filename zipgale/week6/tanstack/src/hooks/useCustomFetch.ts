import { useState, useEffect, useMemo, useRef } from "react";


const STALE_TIME = 5 * 60 * 1_000; // 5분

const MAX_RETRIES = 3; // 최대 재시도 횟수

const INITIAL_RETRY_DELAY = 1000; // 1초
//로컬 스토리지에 저장할 데이터 구조
interface CacheEntry<T> {
  data: T;
  lastFetched: number; // 데이터를 마지막으로 가져온 시간 (타임스탬프)
}

export const useCustomFetch = <T>(url: string) => {
   const [data, setData] = useState<T | null>(null);
   const [isPending, setIsPending] = useState<boolean>(false);
   const [isError, setIsError] = useState<boolean>(false);
   const storageKey = useMemo(() => url, [url]); // 저장소의 키
  
   const abortControllerRef = useRef<AbortController | null>(null);
  
   const retryTimeoutRef = useRef<number | null>(null); // 재시도 횟수 추적
  useEffect(() => {
  abortControllerRef.current = new AbortController();

  const fetchData = async (currentRetry = 0) => {
    setIsError(false);
    setIsPending(true);

    try {
      const currentTime = new Date().getTime();
      const catchedItem = localStorage.getItem(storageKey);

      // 캐시된 데이터가 있고, 아직 유효한 경우
      if (catchedItem) {
        try {
          const catchedData: CacheEntry<T> = JSON.parse(catchedItem);

          if (currentTime - catchedData.lastFetched < STALE_TIME) {
            setData(catchedData.data);
            setIsPending(false);
            console.log("캐시된 데이터 사용", url);
            return;
          }

          // 캐시 만료
          setData(catchedData.data);
          console.log("만료된 캐시 데이터 사용", url);
        } catch (error) {
          console.warn("캐시 에러: 캐시 삭제함.", url);
          localStorage.removeItem(storageKey);
        }
      }

      const response = await fetch(url, {
        signal: abortControllerRef.current?.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const newData = (await response.json()) as T;

      setData(newData);

      const newCacheEntry: CacheEntry<T> = {
        data: newData,
        lastFetched: new Date().getTime(),
      };

      localStorage.setItem(storageKey, JSON.stringify(newCacheEntry));
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("요청 취소됨", url);
        return;
      }

      // 재시도
      if (currentRetry < MAX_RETRIES) {
        const retryDelay =
          Math.min(INITIAL_RETRY_DELAY * Math.pow(2, currentRetry), 30_000); // 최대 10초

        console.log(`${currentRetry + 1}번째 재시도`);

        retryTimeoutRef.current = setTimeout(() => {
          fetchData(currentRetry + 1);
        }, retryDelay);
      }
      else {
        //최대 재시도 횟수 초과
        setIsError(true);
        setIsPending(false);
        console.log("최대 재시도 횟수 초과", url);
        return;
      }

      console.log(error);
      setIsError(true);
    } finally {
      setIsPending(false);
    }
  };

  fetchData();

  return () => {
    abortControllerRef.current?.abort();

  //예약된 재시도 타이머 취소
  if(retryTimeoutRef.current) {
    clearTimeout(retryTimeoutRef.current);
    retryTimeoutRef.current = null;
   }
  };
  }, [url, storageKey]);
  
  return {data, isPending, isError};
};