import { z } from 'zod';
import { NewsSchema } from '../../../entities/News';
import api from '../../utils/api';

// Endpoint
export const ENDPOINT_PROCESS_NEWS = '/news/process';

// Request Body Schema
export const ProcessNewsRequestSchema = z.object({
  url: z.string().url(),
});
export type ProcessNewsRequest = z.infer<typeof ProcessNewsRequestSchema>;

// Response Schema
export const ProcessNewsResponseSchema = NewsSchema;
export type ProcessNewsResponse = z.infer<typeof ProcessNewsResponseSchema>;

// Axios Helper Function
export async function processNews(
  body: ProcessNewsRequest,
): Promise<ProcessNewsResponse> {
  const validatedBody = ProcessNewsRequestSchema.parse(body);
  const response = await api.post(ENDPOINT_PROCESS_NEWS, validatedBody);
  return ProcessNewsResponseSchema.parse(response.data);
}
