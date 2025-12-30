'use client';

import { useQuery } from '@tanstack/react-query';
import { getArtistsQueryOptions, GetArtistsParams } from '../../../shared/api/artists';

export const useArtists = (params?: GetArtistsParams) => {
  const queryOptions = getArtistsQueryOptions(params);
  return useQuery(queryOptions);
};
