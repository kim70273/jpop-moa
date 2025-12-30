import { AxiosInstance } from 'axios';
import defaultApi from '../utils/api';
import axios from 'axios';

/**
 * 서버 환경에서 사용할 별도의 Axios 인스턴스를 생성합니다.
 * INTERNAL_BACKEND_URL 환경 변수를 우선적으로 사용하고, 없을 경우 localhost:3001을 사용합니다.
 */
const createServerApi = () => {
  return axios.create({
    baseURL: process.env.INTERNAL_BACKEND_URL || 'http://localhost:3000',
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * API 요청을 위한 옵션 객체를 생성하는 팩토리 함수입니다.
 * 이 함수는 클라이언트와 서버 환경 모두에서 API 요청을 처리할 수 있는
 * queryFn과 toAxios 메서드를 포함하는 객체를 반환합니다.
 *
 * @param queryKeyBase - React Query에서 사용할 기본 쿼리 키 배열입니다.
 * @param fetcher - API 요청을 수행하는 함수입니다. Axios 인스턴스와 파라미터를 인자로 받습니다.
 * @returns 파라미터를 받아 최종 쿼리 옵션 객체를 반환하는 함수를 리턴합니다.
 */
export function createApi<TParams, TResponse>(
  queryKeyBase: string[],
  fetcher: (api: AxiosInstance, params?: TParams) => Promise<TResponse>,
) {
  return (params?: TParams) => {
    const isServer = typeof window === 'undefined';

    // toAxios에서 사용할 API 인스턴스를 환경에 따라 결정합니다.
    // 서버 환경일 경우, 내부 통신용 URL을 사용하는 새로운 인스턴스를 생성합니다.
    // 클라이언트 환경일 경우, 브라우저에서 사용하는 기본 인스턴스를 사용합니다.
    const directApi = isServer ? createServerApi() : defaultApi;

    return {
      queryKey: [...queryKeyBase, params],
      /**
       * 클라이언트 사이드 React Query의 useQuery에서 사용될 기본 queryFn입니다.
       * 항상 클라이언트용 기본 API 인스턴스(defaultApi)를 사용합니다.
       */
      queryFn: () => fetcher(defaultApi, params),
      /**
       * 서버 사이드(prefetchQuery) 또는 클라이언트에서 직접 API 호출이 필요할 때 사용됩니다.
       * 실행되는 환경을 감지하여 적절한 API 인스턴스를 사용합니다.
       */
      toAxios: () => fetcher(directApi, params),
    };
  };
}
