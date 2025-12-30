import { z } from 'zod';
import { NewsSchema } from '../../../entities/News';
import { createApi } from '../createApi';
import { AxiosInstance } from 'axios';

// Endpoint
export const ENDPOINT_GET_NEWS_BY_ID = '/news'; // Base endpoint, ID will be appended

// Request Params Schema
export const GetNewsByIdParamsSchema = z.object({
  id: z.coerce.number().int().min(1),
});
export type GetNewsByIdParams = z.infer<typeof GetNewsByIdParamsSchema>;

// Response Schema
export const GetNewsByIdResponseSchema = NewsSchema;
export type GetNewsByIdResponse = z.infer<typeof GetNewsByIdResponseSchema>;

// Fetcher function
export async function getNewsById(
  api: AxiosInstance,
  params: GetNewsByIdParams,
): Promise<GetNewsByIdResponse> {
  const validatedParams = GetNewsByIdParamsSchema.parse(params);
  const response = await api.get(`${ENDPOINT_GET_NEWS_BY_ID}/${validatedParams.id}`);
  return GetNewsByIdResponseSchema.parse(response.data);
}

// React Query Options Factory
export const getNewsByIdQueryOptions = createApi(
  ['news', 'detail'], // Unique query key for news detail
  getNewsById,
);