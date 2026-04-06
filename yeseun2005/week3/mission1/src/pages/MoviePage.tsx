import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MoviePage() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            const { data } = await axios(
                 `https://api.themoviedb.org/3/movie/popular?language=en=US&page=1`,
                 {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                    },
                 }
            );

            setMovies(data.results);
        };
            
        fetchMovies();
    }, []);

    console.log(movies);
    
    return <div>MoviePage</div>;
}