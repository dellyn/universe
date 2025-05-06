import { useEffect, useState } from 'react';
import { privateHttpClient } from '@api/httpClient';
import { useRefreshToken } from '@hooks/auth/useRefreshToken';
import { tokenService } from '@services/accessToken';
import { StatusCodes } from 'http-status-codes';

/**
 * Hook that provides an HTTP client with automatic token refresh capabilities
 * @returns {Object} Object containing the HTTP client instance and refresh state
 * @property {AxiosInstance} privateHttpClient - Axios instance with auth interceptors
 * @property {boolean} isRefreshing - Whether token refresh is in progress
 */


const addAuthTokenToRequest = (config: any) => {
  if (!config.headers['Authorization']) {
    const accessToken = tokenService.getToken();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }
  return config;
};


export const useHttpClient = () => {
  const { refresh } = useRefreshToken();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRequestError = (error: any) => Promise.reject(error);
  const handleSuccessfulResponse = (response: any) => response;

  const handleResponseError = async (error: any) => {
    const originalRequest = error.config;
    
    // Handle unauthorized errors (401) - attempt token refresh
    if (error?.response?.status === StatusCodes.UNAUTHORIZED && !originalRequest?._retry) {
      originalRequest._retry = true;
      
      try {
        setIsRefreshing(true);
        const newToken = await refresh();
        setIsRefreshing(false);
        
        if (newToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return privateHttpClient(originalRequest);
        }
      } catch (refreshError) {
        setIsRefreshing(false);
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  };


  useEffect(() => {
    const requestInterceptor = privateHttpClient.interceptors.request.use(
      addAuthTokenToRequest,
      handleRequestError
    );

    const responseInterceptor = privateHttpClient.interceptors.response.use(
      handleSuccessfulResponse,
      handleResponseError
    );

    return () => {
      privateHttpClient.interceptors.request.eject(requestInterceptor);
      privateHttpClient.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return { privateHttpClient, isRefreshing };
};