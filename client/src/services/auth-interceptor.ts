import { AxiosRequestConfig } from 'axios';
import { Constant } from '../models/enums/constant';
import { LocalStorage } from './local-storage';

/** Intercepts and adds authorization header to the request.*/
export default function authInterceptor(request: AxiosRequestConfig): AxiosRequestConfig {
  if (!request.url || !request.baseURL) {
    throw new Error('URL is missing');
  }

  const token = LocalStorage.get(Constant.TokenKey);

  if (token) {
    const newRequest = { ...request };
    newRequest.headers![Constant.AuthHeader] = `${Constant.AuthPrefix} ${token}`;
    return newRequest;
  }

  return request;
}
