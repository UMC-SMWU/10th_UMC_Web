import LpCardSkeleton from "./LpCardSkeleton"

interface LpCardSkeletonListProps {
  count: number
}

const LpCardSkeletonList = ({count}:LpCardSkeletonListProps) => {
  // 몇 개 LpCardSkeleton을 보여줄 건지.
  return (
    <div>
      {new Array(count).fill(0).map((_, idx) => (  // map 의 첫번째 매개변수 사용안할 떄 관례적으로 _ 사용.
        <LpCardSkeleton key={idx} />
      ))}
    </div>
  )
}

export default LpCardSkeletonList