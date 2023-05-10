import { AxiosError } from 'axios';
import { Constant } from '../models/enums/constant';
import { createAxiosInstance } from '../utils/create-axios-instance';
import { refreshToken } from './auth-service';
import { LocalStorage } from './local-storage';

/** Intercept failed request and retry if the request fails because of expired token. */
export default async function failedRequestInterceptor(error: AxiosError): Promise<any> {
  const token = LocalStorage.get(Constant.TokenKey);
  const isTokenExpired = error.response && error.response.status === 401 && token;

  if (isTokenExpired) {
    await refreshToken();
    const { config } = error;
    const axios = createAxiosInstance();
    const response = await axios.request(config);

    return response;
  }
  throw error;
}
