import type { Movie } from '../types/movie';

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({movie} : MovieCardProps) {
    console.log(movie.poster_path);
    return (
        <div>
            <img src={`https://image.tmdb.org/t/p/w500/original${movie.poster_path}`} />
        </div>
    );
}