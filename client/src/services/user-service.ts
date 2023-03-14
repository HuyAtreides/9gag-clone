import { Constant } from '../models/enums/constant';
import { createAxiosInstance } from '../utils/create-axios-instance';
import SectionDto from './dtos/section-dto';
import { UserDto } from './dtos/user-dto';
import { SectionMapper } from './mappers/section-mapper';
import { UserMapper } from './mappers/user-mapper';
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
