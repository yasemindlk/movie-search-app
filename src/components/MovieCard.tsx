'use client';

import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Movie } from '@/types/Movie';

export const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  return (
    <div className="movie-card-container">
      <Card 
        className="movie-card"
        sx={{
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        <CardMedia
          component="img"
          height="300"
          image={movie.Poster}
          alt={movie.Title}
        />
        <CardContent>
          <Typography variant="h6">{movie.Title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {movie.Year}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}; 