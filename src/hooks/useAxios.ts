// src/hooks/useAxios.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError,InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { useAuth } from 'react-oidc-context';
import { baseURL } from '@/services/URLs';

export const useAxios = (): AxiosInstance => {
  const auth = useAuth();
  const axiosInstance = axios.create({
    baseURL: baseURL(),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (auth.isAuthenticated && auth.user?.access_token) {
        const newHeaders = { ...config.headers } as AxiosRequestHeaders;
        newHeaders['Authorization'] = `Bearer ${auth.user.access_token}`;
        
        // Update the config with the new headers
        config.headers = newHeaders;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor to handle 401 errors
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Trigger token refresh
          await auth.signinSilent();
          const newAccessToken = auth.user?.access_token;

          // Retry the original request with the new token
          if (newAccessToken) {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newAccessToken}`,
            };
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          auth.signoutRedirect(); // Redirect to login if refresh fails
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};