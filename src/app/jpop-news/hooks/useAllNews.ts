'use client';

import { useQuery } from '@tanstack/react-query';
import { getNewsQueryOptions, GetNewsParams } from '../../../shared/api/news';

export const useAllNews = (params: GetNewsParams) => {
  const queryOptions = getNewsQueryOptions(params);
  return useQuery(queryOptions);
};
