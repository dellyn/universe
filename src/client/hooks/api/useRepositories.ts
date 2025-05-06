/**
 * Hook for managing repository operations with pagination and caching
 * @param paginationOptions - Optional pagination configuration
 * @returns Repository operations, data and loading states
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createRepositoryApi } from '@api/repositoryApi';
import { Repository } from '@data/types';
import { PaginatedResponse } from '@libraries/interfaces/pagination';
import { usePagination } from '@hooks/pagination/usePagination';
import { useHttpClient } from '@hooks/api/useHttpClient';
import { HttpClientError } from '@api/httpClient';
import { getErrorMessage } from '@api/getErrorMessage';
import { StatusCodes } from 'http-status-codes';
import { useAuthContext } from '@state/AuthContext';

export const REPOSITORIES_QUERY_KEY = 'repositories';
export const useRepositories = (paginationOptions = {}) => {
  const pagination = usePagination(paginationOptions);
  const queryClient = useQueryClient();
  const { privateHttpClient, isRefreshing } = useHttpClient();
  const { user } = useAuthContext();
  const repositoryApi = createRepositoryApi(privateHttpClient);
  
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: [REPOSITORIES_QUERY_KEY, user?.id, pagination.paginationParams],
    queryFn: () => repositoryApi.getUserRepositories(pagination.paginationParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !isRefreshing && !!user?.id,
    // Retry the query if it fails and we're not currently refreshing
    // TODO: should be refactored and moved on the top level of the react-query config
    retry: (failureCount, error: unknown) => {
      const httpError = error as HttpClientError;
      if (httpError?.response?.status === StatusCodes.UNAUTHORIZED && isRefreshing) {
        return false;
      }
      return failureCount < 2;
    },
  });
  
  const addMutation = useMutation({
    mutationFn: repositoryApi.addRepository,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [REPOSITORIES_QUERY_KEY, user?.id] })
  });
  
  const updateMutation = useMutation({
    mutationFn: repositoryApi.updateRepository,
    onSuccess: (updatedRepo) => {
      queryClient.setQueryData(
        [REPOSITORIES_QUERY_KEY, user?.id, pagination.paginationParams],
        (oldData: PaginatedResponse<Repository> | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((repo: Repository) => repo.id === updatedRepo.id ? updatedRepo : repo)
          };
        }
      );
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: repositoryApi.deleteRepository,
    onSuccess: (_, id) => {
      queryClient.setQueryData(
        [REPOSITORIES_QUERY_KEY, user?.id, pagination.paginationParams],
        (oldData: PaginatedResponse<Repository> | undefined) => {
          if (!oldData) return oldData;
          
          const totalItems = oldData.pagination.totalItems - 1;
          const totalPages = Math.ceil(totalItems / pagination.paginationParams.limit);
          
          return {
            ...oldData,
            data: oldData.data.filter((repo: Repository) => repo.id !== id),
            pagination: {
              ...oldData.pagination,
              totalItems,
              totalPages
            }
          };
        }
      );
      
      // If we deleted the last item on the page and there are more pages, go to previous page
      if (data?.data.length === 1 && pagination.page > 1) {
        pagination.prevPage();
      }
      
      queryClient.invalidateQueries({ queryKey: [REPOSITORIES_QUERY_KEY, user?.id] });
    }
  });
  
  return {
    repositories: data?.data || [],
    pagination: {
      ...pagination,
      totalItems: data?.pagination?.totalItems || 0,
      totalPages: data?.pagination?.totalPages || 0
    },
    isLoading,
    isError,
    error: getErrorMessage(error),
    refetch,
    addRepository: addMutation.mutate,
    updateRepository: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteRepository: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    addMutation,
    updateMutation,
    deleteMutation
  };
}; 