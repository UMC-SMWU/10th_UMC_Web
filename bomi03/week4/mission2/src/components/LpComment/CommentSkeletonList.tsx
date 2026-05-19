import CommentSkeleton from "./CommentSkeleton";

type CommentSkeletonListProps = {
  count?: number;
};

const CommentSkeletonList = ({ count = 8 }: CommentSkeletonListProps) => {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <CommentSkeleton key={index} />
      ))}
    </div>
  );
};

export default CommentSkeletonList;
