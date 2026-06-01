import LpCardSkeleton from "./LpCardSkeleton"

interface LpCardSkeletonListProps {
  count: number
}

const LpCardSkeletonList = ({count}:LpCardSkeletonListProps) => {
  // 몇 개 LpCardSkeleton을 보여줄 건지.
  return (
    <div>
      {new Array(count).fill(0).map((_, idx) => (
        <LpCardSkeleton key={idx} />
      ))}
    </div>
  )
}

export default LpCardSkeletonList