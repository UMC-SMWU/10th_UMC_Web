import axios from "axios";

const TMDB_API_KEY = "e77283efb2e5b4a336d00e6dc966f1ab"; 

export const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: TMDB_API_KEY,
  },
});
