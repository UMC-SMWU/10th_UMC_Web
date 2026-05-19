import { useNavigate } from "react-router-dom";
import type { Lp } from "../../types/lp";

type LpCardProps = {
  lp: Lp;
};

const LpCard = ({ lp }: LpCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/lp/${lp.id}`)}
      className="group relative aspect-square cursor-pointer overflow-hidden bg-gray-800"
    >
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
      />

      <div className="absolute inset-0 flex flex-col justify-end bg-black/60 p-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="line-clamp-2 text-sm font-semibold">{lp.title}</p>

        <p className="mt-1 text-xs text-gray-300">
          {new Date(lp.createdAt).toLocaleDateString()}
        </p>

        <p className="mt-1 text-xs">♥ {lp.likes.length}</p>
      </div>
    </div>
  );
};

export default LpCard;
