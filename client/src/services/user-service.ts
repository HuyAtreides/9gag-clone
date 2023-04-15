import { AxiosRequestConfig } from 'axios';
import { Constant } from '../models/enums/constant';
import { FetchUserRequest } from '../models/requests/fetch-user-request';
import { createAxiosInstance } from '../utils/create-axios-instance';
import PageDto from './dtos/page-dto';
import SectionDto from './dtos/section-dto';
import { UserDto } from './dtos/user-dto';
import { UserStatsDto } from './dtos/user-stats-dto';
import { PageMapper } from './mappers/page-mapper';
import { PageOptionsMapper } from './mappers/page-options-mapper';
import { SectionMapper } from './mappers/section-mapper';
import { UserMapper } from './mappers/user-mapper';
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
  const response = await axios.get<PageDto<UserDto>>(url, axiosRequestConfig);

  return PageMapper.fromDto(response.data, UserMapper.fromDto);
}

export async function getUserFollowing(request: FetchUserRequest) {
  const axios = createAxiosInstance();
  const { userId, pageOptions } = request;
  const pageOptionsDto = PageOptionsMapper.toDto(pageOptions);
  const axiosRequestConfig: AxiosRequestConfig = {
    params: pageOptionsDto,
  };
  const url = `${Constant.UserEndpoint}/${userId}/following`;
  const response = await axios.get<PageDto<UserDto>>(url, axiosRequestConfig);

  return PageMapper.fromDto(response.data, UserMapper.fromDto);
}
