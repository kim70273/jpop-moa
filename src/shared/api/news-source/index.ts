import { z } from 'zod';
import { NewsSourceSchema } from '../../../entities/NewsSource';
import api from '../../utils/api';

// Endpoints
export const ENDPOINT_CREATE_NEWS_SOURCE = '/news-source';
export const ENDPOINT_DELETE_ALL_NEWS_SOURCES = '/news-source';

// Request Body Schema for POST /news-source
export const CreateNewsSourceBodySchema = z.object({
  url: z.string().url(),
  description: z.string().optional(),
  artistId: z.number().optional(), // Optional: associate with an artist
});
export type CreateNewsSourceBody = z.infer<typeof CreateNewsSourceBodySchema>;

// Response Schema for POST /news-source
export const CreateNewsSourceResponseSchema = NewsSourceSchema;
export type CreateNewsSourceResponse = z.infer<
  typeof CreateNewsSourceResponseSchema
>;

// Axios Helper Function for POST /news-source
export async function createNewsSource(
  body: CreateNewsSourceBody,
): Promise<CreateNewsSourceResponse> {
  const validatedBody = CreateNewsSourceBodySchema.parse(body);
  const response = await api.post(ENDPOINT_CREATE_NEWS_SOURCE, validatedBody);
  return CreateNewsSourceResponseSchema.parse(response.data);
}

// Axios Helper Function for DELETE /news-source
export async function deleteAllNewsSources(): Promise<void> {
  await api.delete(ENDPOINT_DELETE_ALL_NEWS_SOURCES);
}
