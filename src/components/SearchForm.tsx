'use client';

import { useState } from 'react';
import { TextField, Button } from '@mui/material';

interface SearchFormProps {
  onSubmit: (data: { searchTerm: string; year?: string }) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.length < 2) {
      setError('En az 2 karakter giriniz');
      return;
    }
    
    setError('');
    onSubmit({ searchTerm, year });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(''); 
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchTerm.length < 2) {
        setError('En az 2 karakter giriniz');
        return;
      }
      onSubmit({ searchTerm, year });
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setYear('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        error={!!error}
        helperText={error}
        label="Film Ara"
      />
      <TextField
        value={year}
        onChange={(e) => setYear(e.target.value)}
        label="Yıl"
      />
      <Button type="submit">Ara</Button>
      <Button type="button" onClick={handleClear}>Temizle</Button>
    </form>
  );
}; 