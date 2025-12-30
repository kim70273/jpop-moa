import { z } from 'zod';
import { ArtistSchema } from '../../../entities/Artist'; // Import ArtistSchema directly
import { createApi } from '../createApi';
import { AxiosInstance } from 'axios';

// Endpoint
export const ENDPOINT_GET_ARTISTS = '/artists';

// Request Params Schema
export const GetArtistsParamsSchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().int().min(1).optional(),
});
export type GetArtistsParams = z.infer<typeof GetArtistsParamsSchema>;

// Response Schema
export const GetArtistsResponseSchema = z.array(ArtistSchema); // Redefine using z.array(ArtistSchema)
export type GetArtistsResponse = z.infer<typeof GetArtistsResponseSchema>;

// Fetcher function
export async function getArtists(
  api: AxiosInstance,
  params?: GetArtistsParams,
): Promise<GetArtistsResponse> {
  const validatedParams = GetArtistsParamsSchema.parse(params);
  const response = await api.get(ENDPOINT_GET_ARTISTS, {
    params: validatedParams,
  });
  try {
    return GetArtistsResponseSchema.parse(response.data);
  } catch (error) {
    console.error('Zod parsing error for artists:', error);
    console.error('Backend response data:', response.data);
    throw error; // Re-throw the error so useQuery can catch it
  }
}

// React Query Options Factory
export const getArtistsQueryOptions = createApi(['artists'], getArtists);
