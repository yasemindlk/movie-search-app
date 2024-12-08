import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '../types/Movie';

interface MovieState {
  movies: Movie[];
  movieRatings: { [key: string]: string };
  loading: boolean;
  error: string | null;
  searchTerm: string;
  totalResults: number;
}

const initialState: MovieState = {
  movies: [],
  movieRatings: {},
  loading: false,
  error: null,
  searchTerm: '',
  totalResults: 0
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setMovies: (state, action: PayloadAction<{ movies: Movie[]; totalResults: number }>) => {
      state.movies = action.payload.movies;
      state.totalResults = action.payload.totalResults;
      state.loading = false;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearMovies: (state) => {
      state.movies = [];
      state.searchTerm = '';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setMovieRating: (state, action: PayloadAction<{ imdbID: string; rating: string }>) => {
      state.movieRatings[action.payload.imdbID] = action.payload.rating;
    },
    setMovieRatings: (state, action: PayloadAction<{ [key: string]: string }>) => {
      state.movieRatings = { ...state.movieRatings, ...action.payload };
    }
  }
});

export const { setMovies, setSearchTerm, clearMovies, setLoading, setError, setMovieRating, setMovieRatings } = movieSlice.actions;
export default movieSlice.reducer; 