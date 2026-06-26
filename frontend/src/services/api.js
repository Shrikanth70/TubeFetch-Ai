import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

// Ensure we don't double-append /api/v1 if the user already included it in Vercel
const baseURL = API_BASE_URL.endsWith('/api/v1') 
  ? API_BASE_URL 
  : `${API_BASE_URL}/api/v1`;

export const apiClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Normalize error responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);
