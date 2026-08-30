import axios from 'axios'
import type { Movie } from '../types/movie.ts'

interface MoviesResponse {
  results: Movie[];
  total_pages: number;
}

export async function fetchMovies(query: string, page: number): Promise<MoviesResponse> {
  const response = await axios.get<MoviesResponse>(
    'https://api.themoviedb.org/3/search/movie',
    {
      params: {
        query,
        include_adult: false,
        language: "en-US",
        page,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    }
  );

  return response.data;
}
