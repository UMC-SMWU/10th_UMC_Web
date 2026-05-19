import { useEffect, useState } from "react";
import { PAGINATION_ORDER } from "../enums/common";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { useInView } from "react-intersection-observer";
import { LpCard } from "../components/LpCard/LpCard";
import { LpCardSkeletonList } from "../components/LpCard/LpCardSkeletonList";
import { AddLpModal } from "../components/AddLpModal";

const HomePage = () => {
    const [search, setSearch]=useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // Lp 모달 상태 스위치
    const {data, isFetching, hasNextPage, isPending, fetchNextPage, isError} = useGetInfiniteLpList(50, search, PAGINATION_ORDER.desc);

    // ref -> 특정한 HTML 요소를 감시할 수 있다.
    // inView -> 감시하는 요소가 화면에 있으면 true, 없으면 false
    const {ref, inView} = useInView({
        threshold:0,
    });

    useEffect(() => {
        if (inView) {
            if (!isFetching && hasNextPage) {
                fetchNextPage();
            }
        }
    }, [inView, isFetching, hasNextPage, fetchNextPage]);

    if (isPending) {
        return <div className="mt-20">로딩중...</div>
    }

    if (isError) {
        return <div className="mt-20">에러가 발생했습니다.</div>
    }

    const lps = data;
    // console.log(lps);

    const handleFloatingButtonClick = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="container mx-auto px-4 py-6 bg-neutral-900">
            <input value={search} onChange={(e) => setSearch(e.target.value)} />

            <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 "}>
                {lps?.pages
                    ?.map((page) => page.data.data)
                    ?.flat()
                    ?.map((lp) => <LpCard key={lp.id} lp={lp} />)}
                    {isFetching && <LpCardSkeletonList count={20}/>}
            </div>
            <div ref={ref} className="h-2"></div>

            {/* 우측 하단 고정 플로팅 버튼 */}
            <button 
                onClick={handleFloatingButtonClick}
                className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out"
                aria-label="추가 버튼"
            >
                {/* SVG를 이용한 + 기호 아이콘 */}
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
            </button>
            <AddLpModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    )
};

export default HomePage;
