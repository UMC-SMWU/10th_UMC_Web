export const LoadingSpinner = () => {
  return (
    <div
      className="size-12 animate-spin rounded-full border-6 
      border-t-transparent border-[#b2dab1] "
      role="status"
    >
      <span className="sr-only">로딩중...</span> 
      {/* 텍스트가 안보이도록 sr-only */}
    </div>
  );
};