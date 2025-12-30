'use client';

import * as React from 'react';
import { useLatestNews } from '../hooks/useLatestNews';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import NewsCard from './NewsCard';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';

export default function LatestNewsSection() {
  const { data: latestNews, isLoading, error } = useLatestNews(5);

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

    if (!latestNews || latestNews.length === 0) {
      return <Typography sx={{ my: 2 }}>최신 뉴스가 없습니다.</Typography>;
    }

    return (
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {latestNews.map((newsItem) => (
          <NewsCard key={newsItem.id} newsItem={newsItem} />
        ))}
      </List>
    );
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        J-POP 최신 소식
      </Typography>
      {renderContent()}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" component={Link} href="/jpop-news">
          더보기
        </Button>
      </Box>
    </Box>
  );
}
