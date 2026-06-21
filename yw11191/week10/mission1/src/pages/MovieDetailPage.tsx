import { useParams } from "react-router-dom"

export default function MovieDetailPage() {
    const { id } = useParams<{ id:string }>();
    return (
        <div className="text-center">
            {id}번 영화 상세 페이지입니다
        </div>
    )
}