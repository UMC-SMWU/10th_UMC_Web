interface Props {
    imagePath: string | null; // 배우, 감독의 프로필 이미지 경로
    name: string; // 이름
    subText: string; // 부가 설명
}

export default function CastCard({ imagePath, name, subText }: Props) {
  const img = imagePath
    ? `https://image.tmdb.org/t/p/w185${imagePath}`
    : "https://placehold.co/100?text=No+Image"; // 이미지가 없는 경우 대체 이미지 사용

  return (
    <div className="flex flex-col items-center min-w-25">
      <img
        src={img}
        alt={`${name} 프로필 이미지`}
        className="w-20 h-20 rounded-full object-cover"
      />
      <p className="text-sm mt-2">{name}</p>
      <p className="text-xs text-gray-400">{subText}</p>
    </div>
  );
}