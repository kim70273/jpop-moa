'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getNewsByIdQueryOptions,
  GetNewsByIdParams,
} from '../../../../shared/api/news-id';

export const useNewsItem = (params: GetNewsByIdParams) => {
  const queryOptions = getNewsByIdQueryOptions(params);
  return useQuery(queryOptions);
};
