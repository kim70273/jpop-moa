import { useQuery } from '@tanstack/react-query';
import { getLatestNewsQueryOptions, GetLatestNewsResponse } from '../../shared/api/news-latest';

export const useLatestNews = (limit: number = 5) => {
  return useQuery(getLatestNewsQueryOptions({ limit }));
};
