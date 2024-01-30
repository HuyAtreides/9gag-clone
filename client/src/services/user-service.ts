import { AxiosRequestConfig } from 'axios';
import { Constant } from '../models/enums/constant';
import { FetchUserRequest } from '../models/requests/fetch-user-request';
import { PageFetchingRequest } from '../models/requests/page-fetching-request';
import UpdatePasswordData from '../models/update-password-data';
import { UpdateProfileData } from '../models/update-profile-data';
import { createAxiosInstance } from '../utils/create-axios-instance';
import SectionDto from './dtos/section-dto';
import SliceDto from './dtos/slice-dto';
import { UserDto } from './dtos/user-dto';
import UserSecretDto from './dtos/user-secret-dto';
import { UserStatsDto } from './dtos/user-stats-dto';
import { PageOptionsMapper } from './mappers/page-options-mapper';
import { SectionMapper } from './mappers/section-mapper';
import { SliceMapper } from './mappers/slice-mapper';
import { UpdatePasswordDataMapper } from './mappers/update-password-data-mapper';
import { UpdateProfileDataMapper } from './mappers/update-profile-data-mapper';
import { UserMapper } from './mappers/user-mapper';
import { UserSecretMapper } from './mappers/user-secret-mapper';
import { UserStatsMapper } from './mappers/user-stats-mapper';

export function addSectionToUserFavoriteSections(id: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.SectionEndpoint}/favorite/${id}`;
  axios.put(url);
}

export function removeSectionFromUserFavoriteSections(id: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.SectionEndpoint}/favorite/${id}`;
  axios.delete(url);
}

export async function getUserFavoriteSections() {
  const axios = createAxiosInstance();
  const url = `${Constant.SectionEndpoint}/favorite`;
  const response = await axios.get<SectionDto[]>(url);

  return response.data.map((sectionDto) => SectionMapper.fromDto(sectionDto));
}

export async function searchUser({ pageOptions }: PageFetchingRequest) {
  const axios = createAxiosInstance();
  const url = `${Constant.UserEndpoint}/search`;
  const axiosRequestConfig: AxiosRequestConfig = {
    params: PageOptionsMapper.toDto(pageOptions),
  };

  const response = await axios.get<SliceDto<UserDto>>(url, axiosRequestConfig);
  return SliceMapper.fromDto(response.data, UserMapper.fromDto);
}

export async function getRecentSearchUser({ pageOptions }: PageFetchingRequest) {
  const axios = createAxiosInstance();
  const url = `${Constant.UserEndpoint}/recent-search`;
  const axiosRequestConfig: AxiosRequestConfig = {
    params: PageOptionsMapper.toDto(pageOptions),
  };

  const response = await axios.get<SliceDto<UserDto>>(url, axiosRequestConfig);
  return SliceMapper.fromDto(response.data, UserMapper.fromDto);
}

export async function addUserToRecentSearch(userId: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.UserEndpoint}/recent-search/${userId}`;
  await axios.put<void>(url);
}

export async function removeUserFromRecentSearch(userId: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.UserEndpoint}/recent-search/${userId}`;
  await axios.delete<void>(url);
}

export async function blockUser(userId: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.UserEndpoint}/block/${userId}`;
  await axios.put<void>(url);
}

export async function unblockUser(userId: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.UserEndpoint}/unblock/${userId}`;
  await axios.put<void>(url);
}

export async function getUserBlocking(request: PageFetchingRequest) {
  const { pageOptions } = request;
  const axios = createAxiosInstance();
  const pageOptionsDto = PageOptionsMapper.toDto(pageOptions);
  const requestConfig: AxiosRequestConfig = {
    params: pageOptionsDto,
  };
  const url = `${Constant.UserEndpoint}/blocking`;
  const response = await axios.get<SliceDto<UserDto>>(url, requestConfig);

  return SliceMapper.fromDto(response.data, UserMapper.fromDto);
}

export async function getRestrictingUser(request: PageFetchingRequest) {
  const { pageOptions } = request;
  const axios = createAxiosInstance();
  const pageOptionsDto = PageOptionsMapper.toDto(pageOptions);
  const requestConfig: AxiosRequestConfig = {
    params: pageOptionsDto,
  };
  const url = `${Constant.UserEndpoint}/restricting`;
  const response = await axios.get<SliceDto<UserDto>>(url, requestConfig);

  return SliceMapper.fromDto(response.data, UserMapper.fromDto);
}

export async function getSpecificUserInfo(id: number) {
  const axios = createAxiosInstance();
  const response = await axios.get<UserDto>(`${Constant.UserEndpoint}/${id}`);

  return UserMapper.fromDto(response.data);
}

export async function getUserStats(id: number) {
  const axios = createAxiosInstance();
  const response = await axios.get<UserStatsDto>(`${Constant.UserEndpoint}/${id}/stats`);

  return UserStatsMapper.fromDto(response.data);
}

export async function followUser(id: number) {
  const axios = createAxiosInstance();
  await axios.put<void>(`${Constant.UserEndpoint}/follow/${id}`);
}

export async function unFollowUser(id: number) {
  const axios = createAxiosInstance();
  await axios.put<void>(`${Constant.UserEndpoint}/unfollow/${id}`);
}

export async function removeUserFollower(id: number) {
  const axios = createAxiosInstance();
  await axios.delete<void>(`${Constant.UserEndpoint}/follower/${id}`);
}

export async function getUserFollowers(request: FetchUserRequest) {
  const axios = createAxiosInstance();
  const { userId, pageOptions } = request;
  const pageOptionsDto = PageOptionsMapper.toDto(pageOptions);
  const axiosRequestConfig: AxiosRequestConfig = {
    params: pageOptionsDto,
  };
  const url = `${Constant.UserEndpoint}/${userId}/followers`;
  const response = await axios.get<SliceDto<UserDto>>(url, axiosRequestConfig);

  return SliceMapper.fromDto(response.data, UserMapper.fromDto);
}

export async function getUserFollowing(request: FetchUserRequest) {
  const axios = createAxiosInstance();
  const { userId, pageOptions } = request;
  const pageOptionsDto = PageOptionsMapper.toDto(pageOptions);
  const axiosRequestConfig: AxiosRequestConfig = {
    params: pageOptionsDto,
  };
  const url = `${Constant.UserEndpoint}/${userId}/following`;
  const response = await axios.get<SliceDto<UserDto>>(url, axiosRequestConfig);

  return SliceMapper.fromDto(response.data, UserMapper.fromDto);
}

export async function updateUserProfile(updateProfileData: UpdateProfileData) {
  const axios = createAxiosInstance();
  const updateProfileDataDto = UpdateProfileDataMapper.toDto(updateProfileData);
  const response = await axios.put<UserSecretDto>(
    `${Constant.UserEndpoint}/profile`,
    updateProfileDataDto,
  );

  return UserSecretMapper.fromDto(response.data);
}

export async function updateUserPassword(updatePasswordData: UpdatePasswordData) {
  const axios = createAxiosInstance();
  const updatePasswordDataDto = UpdatePasswordDataMapper.toDto(updatePasswordData);
  await axios.put<void>(`${Constant.UserEndpoint}/password`, updatePasswordDataDto);
}

export async function restrictUser(userId: number) {
  const axios = createAxiosInstance();
  await axios.put<void>(`${Constant.UserEndpoint}/restrict/${userId}`);
}

export async function unRestrictUser(userId: number) {
  const axios = createAxiosInstance();
  await axios.put<void>(`${Constant.UserEndpoint}/un-restrict/${userId}`);
}
