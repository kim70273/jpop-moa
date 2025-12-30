'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button'; // Import Button

interface NewsSearchProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  searchFields: string;
  onSearchFieldsChange: (fields: string) => void;
}

export default function NewsSearch({
  searchTerm,
  onSearchTermChange,
  searchFields,
  onSearchFieldsChange,
}: NewsSearchProps) {
  const [localSearchTerm, setLocalSearchTerm] = React.useState(searchTerm); // Local state for input

  React.useEffect(() => {
    setLocalSearchTerm(searchTerm); // Sync local state with prop when prop changes
  }, [searchTerm]);

  const handleFieldsChange = (event: SelectChangeEvent) => {
    onSearchFieldsChange(event.target.value as string);
  };

  const handleSearchClick = () => {
    onSearchTermChange(localSearchTerm); // Trigger search only on click
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSearchTermChange(localSearchTerm); // Trigger search on Enter key press
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        mt: 4,
        justifyContent: 'center', // Center the content
      }}
    >
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="search-fields-label">검색 필드</InputLabel>
        <Select
          labelId="search-fields-label"
          id="search-fields-select"
          value={searchFields}
          label="검색 필드"
          onChange={handleFieldsChange}
        >
          <MenuItem value="title,content">제목 + 내용</MenuItem>
          <MenuItem value="title">제목</MenuItem>
          <MenuItem value="content">내용</MenuItem>
        </Select>
      </FormControl>
      <TextField
        sx={{ flexGrow: 1, maxWidth: 500 }}
        label="뉴스 검색"
        variant="outlined"
        value={localSearchTerm}
        onChange={(e) => setLocalSearchTerm(e.target.value)} // Update local state
        onKeyPress={handleKeyPress} // Handle Enter key press
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Button onClick={handleSearchClick} variant="contained">
                검색
              </Button>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
