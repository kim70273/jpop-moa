'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import ArtistFilter from './ArtistFilter';
import CategoryFilter from './CategoryFilter';
import { Artist } from '../../../entities/Artist';

interface NewsFiltersProps {
  selectedArtist: Artist | null;
  onArtistChange: (artist: Artist | null) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function NewsFilters({
  selectedArtist,
  onArtistChange,
  selectedCategory,
  onCategoryChange,
}: NewsFiltersProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
      <ArtistFilter selectedArtist={selectedArtist} onChange={onArtistChange} />
      <CategoryFilter
        selectedCategory={selectedCategory}
        onChange={onCategoryChange}
      />
    </Box>
  );
}
