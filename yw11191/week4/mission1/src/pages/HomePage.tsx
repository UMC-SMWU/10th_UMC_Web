import { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";

const HomePage = () => {
    const [search, setSearch]=useState("타입");
    const {data, isPending, isError} = useGetLpList({
        search,
    });

    if (isPending) {
        return <div className="mt-20">로딩중...</div>
    }

    if (isError) {
        return <div className="mt-20">에러가 발생했습니다.</div>
    }

    return (
        <div className="mt-20">
            <input value={search} onChange={(e) => setSearch(e.target.value)} />
            {data.map((lp) => <h1 key={lp.id}>{lp.title}</h1>)}
        </div>
    )
};

export default HomePage;
