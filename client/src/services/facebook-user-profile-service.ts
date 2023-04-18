import axios, { AxiosRequestConfig } from 'axios';
import FacebookUserProfile from './dtos/facebook-user-profile';
import { FacebookUserProfileMapper } from './mappers/facebook-user-profile-mapper';

export async function getFacebookUserProfile(accessToken: string) {
  const axiosRequestConfig: AxiosRequestConfig = {
    params: {
      fields: 'id,name,email,picture.type(large)',
      access_token: accessToken,
    },
    headers: {
      Accept: 'application/json',
    },
  };
  const response = await axios.get<FacebookUserProfile>(
    `https://graph.facebook.com/v16.0/me`,
    axiosRequestConfig,
  );

  return FacebookUserProfileMapper.fromDto(response.data);
}
