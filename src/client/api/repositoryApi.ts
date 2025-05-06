import { Repository } from '@data/types';
import { PaginationParams, PaginatedResponse } from '@libraries/interfaces/pagination';
import { HttpClientInstance } from '@api/httpClient';
import { ApiEndpoints } from '@data/apiInterface';

export const createRepositoryApi = (httpClient: HttpClientInstance) => {
  const extractData = <T>(response: { data: T }) => response.data;
  
  return {
    addRepository: async (repoPath: string) => 
      httpClient.post<{ data: Repository }>(ApiEndpoints.Repositories, { repoPath }).then(res => res.data.data),
    
    getUserRepositories: async (pagination?: PaginationParams) => {
      const params = pagination 
        ? { page: String(pagination.page), limit: String(pagination.limit) } 
        : {};
      
      return httpClient.get<PaginatedResponse<Repository>>(ApiEndpoints.Repositories, { params })
        .then(extractData);
    },
    
    getRepository: (id: string) => 
      httpClient.get<{ data: Repository }>(`${ApiEndpoints.Repositories}/${id}`)
        .then(res => res.data.data),
    
    updateRepository: (id: string) => 
      httpClient.put<{ data: Repository }>(`${ApiEndpoints.Repositories}/${id}/update`)
        .then(res => res.data.data),
    
    deleteRepository: (id: string) => 
      httpClient.delete(`${ApiEndpoints.Repositories}/${id}`)
  };
}; 