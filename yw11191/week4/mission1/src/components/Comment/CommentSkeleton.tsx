export const CommentSkeleton = () => {
  return (
    <div className="flex gap-3 py-4 animate-pulse">
      <div className="w-10 h-10 bg-neutral-800 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-neutral-800 rounded w-24" />
        <div className="h-4 bg-neutral-800 rounded w-full" />
      </div>
    </div>
  );
};

export const CommentSkeletonList = ({ count }: { count: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <CommentSkeleton key={i} />
    ))}
  </>
);