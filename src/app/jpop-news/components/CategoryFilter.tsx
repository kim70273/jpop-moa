'use client';

import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// Assumed mapping for categories
const CATEGORY_MAP = [
  { korean: '음반', english: 'Album' },
  { korean: '공연', english: 'Concert' },
  { korean: '미디어', english: 'Media' },
  { korean: '굿즈', english: 'Goods' },
  { korean: '기타', english: 'Other' },
];

interface CategoryFilterProps {
  selectedCategory: string; // This will now be the English name
  onChange: (category: string) => void; // This will pass the English name
}

export default function CategoryFilter({
  selectedCategory,
  onChange,
}: CategoryFilterProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as string);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="category-filter-label">카테고리</InputLabel>
      <Select
        labelId="category-filter-label"
        id="category-filter-select"
        value={selectedCategory}
        label="카테고리"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>전체</em>
        </MenuItem>
        {CATEGORY_MAP.map((category) => (
          <MenuItem key={category.english} value={category.english}>
            {category.korean}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
