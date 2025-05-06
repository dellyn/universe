import axios, { AxiosInstance, AxiosError } from 'axios';

const options = {
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  },
}
export const publicHttpClient = axios.create({
  ...options,
});

export const privateHttpClient = axios.create({
  ...options,
  withCredentials: true 
}); 
export type { AxiosInstance as HttpClientInstance, AxiosError as HttpClientError };