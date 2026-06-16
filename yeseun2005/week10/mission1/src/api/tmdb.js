const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const searchMovies = async ({ query, includeAdult, language }) => {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
    query
  )}&include_adult=${includeAdult}&language=${language}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("영화 검색에 실패했습니다.");
  }

  const data = await response.json();
  return data.results || [];
};