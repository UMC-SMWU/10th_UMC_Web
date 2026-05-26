import { PAGINATION_ORDER } from "../enums/common";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import useGetLpList from "../hooks/queries/useGetLpList";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import type { Lp } from "../types/lp";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import useDebounce from "../hooks/useDebounce";
import { SEARCH_DEBOUNCE_DELAY } from "../constants/delay";

const HomePage = () => {
  const [search, setSearch] = useState("");
  //const {data, isPending, isError} = useGetLpList({
  //  search,
  //});
  const debouncedValue = useDebounce(search, SEARCH_DEBOUNCE_DELAY);

  const { data: lps, isFetching, hasNextPage, isPending, fetchNextPage, isError} 
  = useGetInfiniteLpList(10, debouncedValue, PAGINATION_ORDER.desc);
  
  // ref: 특정한 HTML 요소를 감지할 수 있다.
  // inView: 그 요소가 화면에 보이면 true다. 
  const {ref,inView} = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if(inView){
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage])

  /*if(isPending){
    return <div className={'mt-20'}>Loading...</div>
  }*/

  if(isError){
    return <div className={'mt-20'}>Error...</div>
  }

  return (
    <div className='container mx-auto px-4'>
      <input className="border-2 border-solid border-gray-100 text-white my-4 mx-auto" placeholder='검색어를 입력하세요.' value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
        {isPending && <LpCardSkeletonList count = {20} />}
        {lps?.pages
          ?.map((page) => page.data.data)
          ?.flat() // [[1,2],[3,4]].flat() -> [1,2,3,4], data 배열 안에 data 배열 풀어주기
          ?.map((lp : Lp) => <LpCard key={lp.id} lp={lp} />)}
          {isFetching && <LpCardSkeletonList count={20} />}
        <div ref={ref} className="h-2">
        </div>
      </div>
    </div>
  )
}

export default HomePage;