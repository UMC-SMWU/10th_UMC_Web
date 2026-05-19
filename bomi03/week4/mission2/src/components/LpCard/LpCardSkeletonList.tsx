import LpCardSkeleton from "./LpCardSkeleton";

type LpCardSkeletonListProps = {
  count?: number;
};

const LpCardSkeletonList = ({ count = 20 }: LpCardSkeletonListProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <LpCardSkeleton key={index} />
      ))}
    </>
  );
};

export default LpCardSkeletonList;
