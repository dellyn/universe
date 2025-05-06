import { useSearchParams } from 'react-router-dom';

interface PaginationOptions {
  defaultPage?: number;
  defaultLimit?: number;
  maxLimit?: number;
}

/**
 * Hook for managing pagination state in URL search params
 * @param options - Configuration options for pagination
 * @returns Pagination state and methods to control it
 */
export const usePagination = ({
  defaultPage = 1,
  defaultLimit = 5,
  maxLimit = 50
}: PaginationOptions = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = Number(searchParams.get('page') || defaultPage);
  const limit = Number(searchParams.get('limit') || defaultLimit);
  
  const setPage = (newPage: number) => {
    searchParams.set('page', Math.max(1, newPage).toString());
    setSearchParams(searchParams);
  };
  
  const setLimit = (newLimit: number) => {
    const validLimit = Math.min(Math.max(1, newLimit), maxLimit);
    searchParams.set('limit', validLimit.toString());
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };
  
  return {
    page: isNaN(page) || page < 1 ? defaultPage : page,
    limit: isNaN(limit) || limit < 1 || limit > maxLimit ? defaultLimit : limit,
    setPage,
    setLimit,
    nextPage: () => setPage(page + 1),
    prevPage: () => setPage(Math.max(1, page - 1)),
    paginationParams: { 
      page: isNaN(page) || page < 1 ? defaultPage : page, 
      limit: isNaN(limit) || limit < 1 || limit > maxLimit ? defaultLimit : limit 
    }
  };
}; 