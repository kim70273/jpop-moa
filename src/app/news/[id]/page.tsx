'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useNewsItem } from './hooks/useNewsItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import { format } from 'date-fns';

export default function NewsDetailPage() {
  const params = useParams();
  const newsId = params.id ? Number(params.id) : undefined;

  const {
    data: newsItem,
    isLoading,
    error,
  } = useNewsItem({ id: newsId as number }); // Cast to number, as it's checked above

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

  if (!newsItem) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        뉴스를 찾을 수 없습니다.
      </Alert>
    );
  }

  const publishedDate = newsItem.publishedAt
    ? format(new Date(newsItem.publishedAt), 'yyyy년 MM월 dd일')
    : '날짜 미상';

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {newsItem.translatedTitle}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        {newsItem.artist && (
          <Chip
            label={newsItem.artist.koreanName || newsItem.artist.name}
            size="small"
            color="primary"
          />
        )}
        {newsItem.category && (
          <Chip label={newsItem.category} size="small" color="secondary" />
        )}
        <Typography variant="body2" color="text.secondary">
          {publishedDate}
        </Typography>
      </Box>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="body1" paragraph>
          {newsItem.translatedContent}
        </Typography>
      </Paper>

      {newsItem.sourceUrl && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2">
            원문: <Link href={newsItem.sourceUrl} target="_blank" rel="noopener noreferrer">{newsItem.sourceUrl}</Link>
          </Typography>
        </Box>
      )}
    </Box>
  );
}
