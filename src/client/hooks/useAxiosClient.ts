import { useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import { useRefreshToken } from './useRefreshToken';
import { tokenService } from '../services/tokenService';

export const useAxiosClient = () => {
  const { refresh } = useRefreshToken();

  useEffect(() => {
    // Request interceptor - add token to outgoing requests
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      config => {
        // Only add token if not already present
        if (!config.headers['Authorization']) {
          const accessToken = tokenService.getToken();
          if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
          }
        }
        return config;
      }, 
      (error) => Promise.reject(error)
    );

    // Response interceptor - refresh token on 401
    const responseInterceptor = axiosPrivate.interceptors.response.use(
      response => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If we get a 401 (Unauthorized) and haven't tried refreshing yet
        if (error?.response?.status === 401 && !originalRequest?._retry) {
          originalRequest._retry = true; // Mark as retried
          
          try {
            // Get new token
            const newToken = await refresh();
            
            if (newToken) {
              // Update request with new token
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              // Retry the original request
              return axiosPrivate(originalRequest);
            }
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    // Clean up both interceptors when component unmounts
    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return axiosPrivate;
}; 