import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";
import css from './App.module.css'
import type { Movie } from '../../types/movie.ts'
import SearchBar from '../SearchBar/SearchBar.tsx'
import Loader from '../Loader/Loader.tsx'
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx'
import MovieGrid from '../MovieGrid/MovieGrid.tsx'
import MovieModal from '../MovieModal/MovieModal.tsx'
import { fetchMovies } from '../../services/movieService.ts'

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess} = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (isSuccess && data.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  });

  const handleSubmit = async (searchStr: string) => {
    setQuery(searchStr.trim());
    setPage(1);
    setSelectedMovie(null);
  }

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  }

  const handleModalClose = () => {
    setSelectedMovie(null);
  }

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSubmit}/>

      {isLoading && <Loader />}

      {!isLoading && isError && <ErrorMessage />}

      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isSuccess && (movies.length > 0) && <MovieGrid movies={movies} onSelect={handleSelectMovie} />}

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleModalClose} />}
    </div>
  );
}
