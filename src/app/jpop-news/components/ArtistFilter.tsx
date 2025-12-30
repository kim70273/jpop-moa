'use client';

import * as React from 'react';
import { useArtists } from '../hooks/useArtists';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { Artist } from '../../../entities/Artist';
import { useDebounce } from '@uidotdev/usehooks'; // Import useDebounce

interface ArtistFilterProps {
  selectedArtist: Artist | null;
  onChange: (artist: Artist | null) => void;
}

export default function ArtistFilter({
  selectedArtist,
  onChange,
}: ArtistFilterProps) {
  const [inputValue, setInputValue] = React.useState('');
  const debouncedInputValue = useDebounce(inputValue, 300); // Debounce the input

  const { data: artists, isLoading } = useArtists({
    search: debouncedInputValue,
    limit: 5, // Limit to 5 artists as per requirement
  });

  console.log(artists);

  return (
    <Autocomplete
      sx={{ width: 300 }}
      options={artists || []}
      value={selectedArtist}
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      getOptionLabel={(option) => option.koreanName || option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={isLoading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="아티스트 선택"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
