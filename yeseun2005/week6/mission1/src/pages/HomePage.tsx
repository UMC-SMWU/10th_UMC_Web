import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../types/common";

const HomePage = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

    const { data, isPending, isError, refetch } = useGetLpList({
        cursor: 0,
        order,
        limit: 20,
    });

    const handleToggleOrder = () => {
        setOrder((prev) =>
            prev === PAGINATION_ORDER.desc
                ? PAGINATION_ORDER.asc
                : PAGINATION_ORDER.desc
        );
    };

    if (isPending) {
        return <div className="mt-20 px-6">로딩 중...</div>;
    }

    if (isError) {
        return (
            <div className="mt-20 px-6">
                <p>LP 목록을 불러오지 못했습니다.</p>
                <button onClick={() => refetch()}>다시 시도</button>
            </div>
        );
    }

    return (
        <div className="mt-20 px-6">
            <div className="flex justify-end mb-6">
                <button
                    onClick={handleToggleOrder}
                    className="rounded bg-gray-800 text-white px-4 py-2"
                >
                    {order === PAGINATION_ORDER.desc ? "최신순" : "오래된순"}
                </button>
            </div>

            {data?.data.data.length === 0 && (
                <p className="text-center text-gray-500 mt-20">표시할 LP가 없습니다.</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {data?.data.data.map((lp) => (
                    <div
                        key={lp.id}
                        onClick={() => navigate(`/lp/${lp.id}`)}
                        className="relative cursor-pointer overflow-hidden rounded-lg shadow group"
                    >
                        <img
                            src={lp.thumbnail || "https://placehold.co/300x300"}
                            alt={lp.title}
                            className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4 text-white">
                            <h2 className="font-bold">{lp.title}</h2>
                            <p className="text-sm">좋아요 {lp.likes.length}개</p>
                            <p className="text-xs">
                                {new Date(lp.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;