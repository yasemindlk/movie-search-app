'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Pagination,
  Button
} from '@mui/material';
import { setMovies, setSearchTerm, setLoading, setError, setMovieRatings } from '../store/movieSlice';
import { useRouter } from 'next/navigation';
import '../styles/components/MovieList.scss';
import { Movie } from '@/types/Movie';

export const MovieList: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [searchParams, setSearchParams] = useState({
    searchInput: 'Pokemon',
    type: 'movie',
    year: '',
    page: 1
  });

  const [currentSearch, setCurrentSearch] = useState({
    searchInput: 'Pokemon',
    type: 'movie',
    year: '',
    page: 1
  });

  const { movies, loading, error, totalResults, movieRatings } = useSelector((state: RootState) => state.movies);

  const fetchMovieRatings = async (movies: Movie[]) => {
    const newRatings: { [key: string]: string } = {};
    
    await Promise.all(
      movies.map(async (movie) => {
        if (movieRatings[movie.imdbID]) return;

        try {
          const response = await fetch(
            `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
          );
          const data = await response.json();
          newRatings[movie.imdbID] = data.imdbRating || 'N/A';
        } catch (error) {
          console.error(`Error fetching rating for ${movie.Title}:`, error);
          newRatings[movie.imdbID] = 'N/A';
        }
      })
    );

    if (Object.keys(newRatings).length > 0) {
      dispatch(setMovieRatings(newRatings));
    }
  };

  const fetchMovies = async () => {
    try {
      dispatch(setLoading(true));
      let url;
      if (!searchParams.searchInput.trim()) {
        url = `https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&s=Pokemon&type=${searchParams.type}${searchParams.year ? `&y=${searchParams.year}` : ''}&page=${searchParams.page}`;
      } else if (searchParams.searchInput.trim().length < 2) {
        dispatch(setLoading(false));
        return;
      } else {
        url = `https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&s=${searchParams.searchInput}&type=${searchParams.type}${searchParams.year ? `&y=${searchParams.year}` : ''}&page=${searchParams.page}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === 'True') {
        dispatch(setMovies({
          movies: data.Search,
          totalResults: parseInt(data.totalResults)
        }));
        await fetchMovieRatings(data.Search);
        dispatch(setSearchTerm(searchParams.searchInput));
        dispatch(setError(null));
      } else {
        dispatch(setMovies({ movies: [], totalResults: 0 }));
        dispatch(setError(data.Error));
      }
    } catch (error) {
      console.error('Film arama hatası:', error);
      dispatch(setError('Bir hata oluştu'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentSearch(searchParams);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setCurrentSearch(searchParams);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => ({ ...prev, searchInput: e.target.value }));
  };

  const handleTypeChange = (e: any) => {
    setSearchParams(prev => ({ ...prev, type: e.target.value }));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => ({ ...prev, year: e.target.value }));
  };


  useEffect(() => {
    fetchMovies();
  }, [currentSearch]);

  const handlePageChange = (e: any, value: number) => {
    setSearchParams(prev => ({ ...prev, page: value }));
  };

  const handleMovieClick = (imdbID: string) => {
    router.push(`/movie/${imdbID}`);
  };

  return (
    <div className="movie-list">
      <form onSubmit={handleSubmit}>
        <div className="filters">
          <TextField 
            className="search-input"
            label="Film Ara" 
            value={searchParams.searchInput}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            helperText="En az 2 karakter girmelisiniz"
            error={searchParams.searchInput.trim().length === 1}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'var(--mui-palette-background-default)'
              }
            }}
          />
          <Select 
            className="type-select"
            value={searchParams.type} 
            onChange={handleTypeChange}
            sx={{
              backgroundColor: 'var(--mui-palette-background-default)'
            }}
          >
            <MenuItem value="movie">Film</MenuItem>
            <MenuItem value="series">Dizi</MenuItem>
            <MenuItem value="episode">Bölüm</MenuItem>
          </Select>
          <TextField 
            className="year-input"
            label="Yıl" 
            value={searchParams.year}
            onChange={handleYearChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'var(--mui-palette-background-default)'
              }
            }}
          />
          <Button 
            className="search-button"
            type="submit" 
            variant="contained"
          >
            Ara
          </Button>
        </div>
      </form>

      {loading ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : error ? (
        <Alert severity="error" className="m-4">{error}</Alert>
      ) : movies.length === 0 ? (
        <Alert severity="info" className="m-4">
          Film bulunamadı. Lütfen farklı bir arama terimi deneyin.
        </Alert>
      ) : (
        <>
          <Grid container spacing={3} className="grid-container">
            {movies.map((movie) => (
              <Grid item xs={12} sm={6} md={3} lg={2.4} key={movie.imdbID}>
                <Card 
                  className="movie-card"
                  onClick={() => handleMovieClick(movie.imdbID)}
                >
                  <CardMedia
                    component="img"
                    className="movie-poster"
                    image={movie.Poster !== 'N/A' ? movie.Poster : '/no-poster.png'}
                    alt={movie.Title}
                  />
                  <CardContent className="card-content">
                    <Typography className="movie-title" variant="h6" noWrap title={movie.Title}>
                      {movie.Title}
                    </Typography>
                    <Typography className="movie-info" variant="body2">
                      {movie.Year}
                    </Typography>
                    <Typography className="movie-info" variant="body2">
                      IMDb: {movieRatings[movie.imdbID] || 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalResults > 10 && (
            <div className="pagination-container">
              <Pagination 
                count={Math.ceil(totalResults / 10)} 
                page={searchParams.page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}; 