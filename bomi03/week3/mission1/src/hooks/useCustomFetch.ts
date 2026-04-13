import { useEffect, useState } from "react";
import axios from "axios";

interface UseCustomFetchResult<T> {
  data: T | null;
  isPending: boolean;
  isError: boolean;
  errorMessage: string;
}

export default function useCustomFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);

  // 로딩 상태 반환
  const [isPending, setIsPending] = useState(false);

  // 에러 상태 반환
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);
      setErrorMessage("");

      try {
        const response = await axios.get<T>(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
        });

        if (isMounted) {
          // 데이터 반환
          setData(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setIsError(true);
          setErrorMessage(
            "데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
          );
          console.error(error);
        }
      } finally {
        if (isMounted) {
          setIsPending(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };

    // URL이 바뀌면 자동 재요청
  }, [url]);

  return {
    data,
    isPending,
    isError,
    errorMessage,
  } satisfies UseCustomFetchResult<T>;
}