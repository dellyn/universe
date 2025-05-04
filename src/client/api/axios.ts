import axios from 'axios';

// Public axios instance for non-authenticated requests
export const axiosPublic = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const axiosPrivate = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Include cookies in requests
}); 