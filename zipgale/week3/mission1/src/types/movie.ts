/*adult: false;
backdrop_path: "/1x9e0qWonw634NhIsRdvnneeqvN.jpg";
genre_ids: (2)[(10749, 18)];
id: 1523145;
original_language: "ru";
original_title: "Твоё сердце будет разбито";
overview: "High school student Polina is saved from bullying at her new school and makes a deal with the main bully Bars: he must pretend to be her boyfriend and protect her, and she must do everything he says. During this game, the couple develops real feelings, but her family and classmates have reasons to separate the lovers.";
popularity: 1201.7892;
poster_path: "/7wIBfBl2gejt6xHxNSK0reVIm7E.jpg";
release_date: "2026-03-26";
title: "Your Heart Will Be Broken";
video: false;
vote_average: 6.986;
vote_count: 36;*/

export type Movie = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export type MovieResponse = { // data의 타입 정의
  page: number;
  results: Movie[];
  totalPages: number;
  total_results: number;
}