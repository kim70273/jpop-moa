import { z } from 'zod';
import { NewsArraySchema } from '../../../entities/News';
import { createApi } from '../createApi';
import { AxiosInstance } from 'axios';

// Endpoint
export const ENDPOINT_GET_LATEST_NEWS = '/news/latest';

// Request Params Schema
export const GetLatestNewsParamsSchema = z.object({
  limit: z.coerce.number().int().min(1).optional(),
});
export type GetLatestNewsParams = z.infer<typeof GetLatestNewsParamsSchema>;

// Response Schema
export const GetLatestNewsResponseSchema = NewsArraySchema;
export type GetLatestNewsResponse = z.infer<typeof GetLatestNewsResponseSchema>;

// Fetcher function
export async function getLatestNews(
  api: AxiosInstance,
  params?: GetLatestNewsParams,
): Promise<GetLatestNewsResponse> {
  const validatedParams = GetLatestNewsParamsSchema.parse(params);
  const response = await api.get(ENDPOINT_GET_LATEST_NEWS, {
    params: validatedParams,
  });
  return GetLatestNewsResponseSchema.parse(response.data);
}

// React Query Options Factory
export const getLatestNewsQueryOptions = createApi(
  ['latestNews'],
  getLatestNews,
);
