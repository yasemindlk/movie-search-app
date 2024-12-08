'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Container,
  Grid,
  Typography,
  Chip,
  Rating,
  CircularProgress,
  Alert,
  Paper,
  Card
} from '@mui/material';
import { MovieDetail as MovieDetailType } from '@/types/Movie';
import '../styles/components/MovieDetail.scss';

const MovieDetail: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?i=${id}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
        );
        const data = await response.json();
        
        if (data.Response === 'False') {
          throw new Error(data.Error);
        }
        
        setMovie(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <Alert severity="error" className="error-alert">
        {error || 'Film bilgileri yüklenemedi'}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card className="movie-detail">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <img 
              src={movie.Poster !== 'N/A' ? movie.Poster : '/no-poster.png'}
              alt={movie.Title}
              className="movie-poster"
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <div className="content-container">
              <Typography className="movie-title" variant="h4" component="h1">
                {movie.Title}
              </Typography>
              
              <Typography className="movie-subtitle" variant="subtitle1">
                {movie.Year} • {movie.Runtime} • {movie.Rated}
              </Typography>

              <div className="genre-chips">
                {movie.Genre.split(', ').map((genre) => (
                  <Chip key={genre} label={genre} />
                ))}
              </div>

              <div className="rating-container">
                <Typography variant="h6" className="info-label">
                  IMDb Puanı:
                </Typography>
                <Rating 
                  className="rating"
                  value={Number(movie.imdbRating) / 2} 
                  precision={0.1} 
                  readOnly 
                />
                <Typography variant="body2">
                  ({movie.imdbRating}/10)
                </Typography>
              </div>

              <div className="movie-info">
                <Typography className="movie-plot" variant="body1" paragraph>
                  {movie.Plot}
                </Typography>

                <Typography className="info-row" variant="body1">
                  <span className="info-label">Yönetmen:</span>
                  {movie.Director}
                </Typography>
                
                <Typography className="info-row" variant="body1">
                  <span className="info-label">Yazarlar:</span>
                  {movie.Writer}
                </Typography>
                
                <Typography className="info-row" variant="body1">
                  <span className="info-label">Oyuncular:</span>
                  {movie.Actors}
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default MovieDetail; 