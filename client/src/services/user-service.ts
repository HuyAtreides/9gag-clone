import { Constant } from '../models/enums/constant';
import { createAxiosInstance } from '../utils/create-axios-instance';
import SectionDto from './dtos/section-dto';
import { UserDto } from './dtos/user-dto';
import { UserStatsDto } from './dtos/user-stats-dto';
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
