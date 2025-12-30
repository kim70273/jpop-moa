import { z } from 'zod';
import { NewsArraySchema, NewsSchema } from '../../../entities/News';
import { createApi } from '../createApi';
import { AxiosInstance } from 'axios';

// Endpoint
export const ENDPOINT_GET_NEWS = '/news';

// Request Params Schema
export const GetNewsParamsSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).optional(),
  artistId: z.coerce.number().int().min(1).optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  searchFields: z.string().optional(), // e.g., "title", "content", "title,content"
});
export type GetNewsParams = z.infer<typeof GetNewsParamsSchema>;

// Response Schema
export const GetNewsResponseSchema = z.object({
  data: NewsArraySchema,
  total: z.number(),
});
export type GetNewsResponse = z.infer<typeof GetNewsResponseSchema>;

// Fetcher function
export async function getNews(
  api: AxiosInstance,
  params?: GetNewsParams,
): Promise<GetNewsResponse> {
  const validatedParams = GetNewsParamsSchema.parse(params);
  const response = await api.get(ENDPOINT_GET_NEWS, {
    params: validatedParams,
  });
  return GetNewsResponseSchema.parse(response.data);
}

// React Query Options Factory
export const getNewsQueryOptions = createApi(['news'], getNews);