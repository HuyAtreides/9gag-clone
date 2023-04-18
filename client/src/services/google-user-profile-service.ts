import axios, { AxiosRequestConfig } from 'axios';
import GoogleUserProfile from './dtos/google-user-profile';
import { GoogleUserProfileMapper } from './mappers/google-user-profile-mapper';

export async function getGoogleUserProfile(accessToken: string) {
  const axiosRequestConfig: AxiosRequestConfig = {
    params: {
      personFields: 'photos,names,emailAddresses,metadata,addresses',
      sources: 'READ_SOURCE_TYPE_PROFILE',
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  };
  const response = await axios.get<GoogleUserProfile>(
    `https://people.googleapis.com/v1/people/me`,
    axiosRequestConfig,
  );

  return GoogleUserProfileMapper.fromDto(response.data);
}
