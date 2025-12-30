'use client';

import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAllNews } from './hooks/useAllNews';
import NewsCard from '../components/NewsCard';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import Pagination from '@mui/material/Pagination';
import NewsFilters from './components/NewsFilters';
import { Artist } from '../../entities/Artist';
import { useDebounce } from '@uidotdev/usehooks';
import NewsSearch from './components/NewsSearch';

const NEWS_PER_PAGE = 10;

export default function JpopNewsPage() {
  const [page, setPage] = React.useState(1);
  const [selectedArtist, setSelectedArtist] = React.useState<Artist | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchFields, setSearchFields] = React.useState<string>(
    'title,content',
  );

  const debouncedArtistId = useDebounce(selectedArtist?.id, 300);
  const debouncedCategory = useDebounce(selectedCategory, 300);
  // Removed debouncedSearchTerm as search is now explicit

  const { data, isLoading, error } = useAllNews({
    page,
    limit: NEWS_PER_PAGE,
    artistId: debouncedArtistId,
    category: debouncedCategory || undefined,
    search: searchTerm || undefined, // Use searchTerm directly
    searchFields: searchTerm ? searchFields : undefined,
  });

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleArtistChange = (artist: Artist | null) => {
    setSelectedArtist(artist);
    setPage(1); // Reset page to 1 when filter changes
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1); // Reset page to 1 when filter changes
  };

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleSearchFieldsChange = (fields: string) => {
    setSearchFields(fields);
    setPage(1);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          오류 발생: {error.message}
        </Alert>
      );
    }

    if (!data || data.data.length === 0) {
      return <Typography sx={{ my: 2 }}>뉴스가 없습니다.</Typography>;
    }

    return (
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {data.data.map((newsItem) => (
          <NewsCard key={newsItem.id} newsItem={newsItem} />
        ))}
      </List>
    );
  };

  const totalPages = data ? Math.ceil(data.total / NEWS_PER_PAGE) : 0;

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        J-POP 뉴스
      </Typography>

      <NewsFilters
        selectedArtist={selectedArtist}
        onArtistChange={handleArtistChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <Box sx={{ mt: 2 }}>
        {renderContent()}
        {totalPages > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
        <NewsSearch
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          searchFields={searchFields}
          onSearchFieldsChange={handleSearchFieldsChange}
        />
      </Box>
    </>
  );
}
