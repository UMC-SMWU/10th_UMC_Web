import { useState, useEffect } from 'react';
import axiosInstance from '../apis/axiosInstance';

function useCustomFetch<T>(url: string) { // T: Type
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            // 새로운 요청 시작 시 상태 초기화
            setIsPending(true);
            setIsError(false);

            try {
                const response = await axiosInstance.get<T>(url);
                setData(response.data);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        if (url) {
            fetchData();
        }
    }, [url]); // url이 바뀌면 자동으로 재실행 (의존성 관리)

    return { data, isPending, isError };
}

export default useCustomFetch;