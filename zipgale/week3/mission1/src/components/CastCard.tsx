import type { MovieCast } from "../types/movie";

interface CastCardProps {
  cast: MovieCast;
}

export const CastCard = ({ cast }: CastCardProps) => {
  return(
    <>
      <div>
        <div className="aspect-square w-full rounded-full overflow-hidden border-2 border-gray-300">
        <img
          src={`https://image.tmdb.org/t/p/w500${cast.profile_path}`}
          alt={cast.name}
          className="w-full h-full object-cover"
        />
      </div>
        <h3 className="text-center text-lg font-bold mt-2 text-white">{cast.name}</h3>
        <p className="text-center text-gray-500">{cast.character} ({cast.known_for_department})</p>
      </div>
    </>
  )
}