import * as React from 'react';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { getLatestNewsQueryOptions } from '../shared/api/news-latest';
import LatestNewsSection from './components/LatestNewsSection';
import { TrendingJpopSection } from './components/TrendingJpopSection';
import Typography from '@mui/material/Typography';
import { Metadata } from 'next';

// SEO Metadata
export const metadata: Metadata = {
  title: 'JPOP-MOA 홈',
  description: '최신 J-POP 뉴스 및 소식을 한눈에 확인하세요.',
};

// Server-side data fetching for initial hydration
export default async function HomePage() {
  const queryClient = new QueryClient();
  const queryOptions = getLatestNewsQueryOptions({ limit: 5 });

  await queryClient.prefetchQuery({
    queryKey: queryOptions.queryKey,
    queryFn: queryOptions.toAxios,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Typography variant="h4" component="h1" gutterBottom>
        홈
      </Typography>

      <TrendingJpopSection />
      <LatestNewsSection />
    </HydrationBoundary>
  );
}
