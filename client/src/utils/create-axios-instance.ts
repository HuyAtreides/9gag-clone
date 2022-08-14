import axios, { AxiosError, AxiosInstance } from 'axios';
import authInterceptor from '../services/auth-interceptor';
import failedRequestInterceptor from '../services/failed-request-interceptor';

/** Create axios instance with interceptor and baseURL. */
export function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });
  instance.interceptors.request.use(authInterceptor, (error: AxiosError) => {
    throw error;
  });
  instance.interceptors.response.use((response) => response, failedRequestInterceptor);
  return instance;
}
