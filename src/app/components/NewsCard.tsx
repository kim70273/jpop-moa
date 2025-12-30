'use client';

import * as React from 'react';
import { News } from '../../entities/News';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link'; // Import Next.js Link

interface NewsCardProps {
  newsItem: News;
}

export default function NewsCard({ newsItem }: NewsCardProps) {
  const formattedDate = newsItem.publishedAt
    ? format(parseISO(newsItem.publishedAt), 'yyyy년 MM월 dd일', {
        locale: ko,
      })
    : '날짜 정보 없음';

  return (
    <Card sx={{ mb: 2 }}>
      <CardActionArea
        component={Link} // Use Next.js Link component
        href={`/news/${newsItem.id}`} // Link to internal detail page
      >
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom>
            {newsItem.translatedTitle}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'text.secondary',
              mt: 1,
            }}
          >
            <Typography variant="body2">
              {newsItem.artist?.koreanName ||
                newsItem.artist?.name ||
                '알 수 없는 아티스트'}
            </Typography>
            <Typography variant="body2">{formattedDate}</Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
