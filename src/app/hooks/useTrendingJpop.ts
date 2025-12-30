import { useQuery } from '@tanstack/react-query';
import { getTrendingJpop } from '@/shared/api/youtube/trending-jpop';

export const useTrendingJpop = () => {
  return useQuery({
    queryKey: ['trending-jpop'],
    queryFn: getTrendingJpop,
  });
};
