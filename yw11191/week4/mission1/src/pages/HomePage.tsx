import { useEffect, useState } from "react";
import { PAGINATION_ORDER } from "../enums/common";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { useInView } from "react-intersection-observer";
import { LpCard } from "../components/LpCard/LpCard";
import { LpCardSkeletonList } from "../components/LpCard/LpCardSkeletonList";

const HomePage = () => {
    const [search, setSearch]=useState("");
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

    console.log(lps);

    return (
        <div  className="container mx-auto px-4 py-6">
            <input value={search} onChange={(e) => setSearch(e.target.value)} />

            <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}>
                {lps?.pages
                    ?.map((page) => page.data.data)
                    ?.flat()
                    ?.map((lp) => <LpCard key={lp.id} lp={lp} />)}
                    {isFetching && <LpCardSkeletonList count={20}/>}
            </div>
            <div ref={ref} className="h-2"></div>
        </div>
    )
};

export default HomePage;
