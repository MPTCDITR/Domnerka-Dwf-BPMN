import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { useAuth } from 'react-oidc-context';
import { baseURL } from '@/services/URLs';

export const useAxios = (): AxiosInstance => {
  const auth = useAuth();

  // Create an Axios instance with a base URL and default headers
  const axiosInstance = axios.create({
    baseURL: baseURL(),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Request interceptor to attach the Bearer token
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (auth.isAuthenticated && auth.user?.access_token) {
        config.headers.Authorization = `Bearer ${auth.user.access_token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle 401 errors and token refresh
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log('Response successful:', response.status);
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && !originalRequest?._retry) {
        originalRequest._retry = true;

        try {
          // Attempt to refresh the token
          await auth.signinSilent();
          const newAccessToken = auth.user?.access_token;

          // Retry the original request with the new token
          if (newAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Redirect to login if token refresh fails
          auth.signoutRedirect();
          return Promise.reject(refreshError);
        }
      }

      // Propagate other errors
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};