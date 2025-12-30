import api from '@/shared/utils/api';
import { z } from 'zod';

const trendingJpopVideoSchema = z.object({
  videoId: z.string(),
  title: z.string(),
  thumbnailUrl: z.string().url(),
});

const trendingJpopResponseSchema = z.array(trendingJpopVideoSchema);

export const getTrendingJpop = async () => {
  const response = await api.get('/youtube/trending-jpop');
  return trendingJpopResponseSchema.parse(response.data);
};
