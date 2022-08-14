import { Constant } from '../models/enums/constant';
import RegisterData from '../models/register-data';
import { User } from '../models/user';
import { UserSecret } from '../models/user-secret';
import { createAxiosInstance } from '../utils/create-axios-instance';
import { UserDto } from './dtos/user-dto';
import UserSecretDto from './dtos/user-secret-dto';
import { RegisterDataMapper } from './mappers/register-data-mapper';
import { UserMapper } from './mappers/user-mapper';
import { UserSecretMapper } from './mappers/user-secret-mapper';

const REGISTER_END_POINT = `${Constant.AuthEndpoint}/register`;

export async function registerUser(registerData: RegisterData): Promise<UserSecret> {
  const registerDataDto = RegisterDataMapper.toDto(registerData);
  const axios = createAxiosInstance();
  const response = await axios.post<UserSecretDto>(REGISTER_END_POINT, registerDataDto);

  return UserSecretMapper.fromDto(response.data);
}

export async function getUserInfo(): Promise<User> {
  const axios = createAxiosInstance();
  const response = await axios.get<UserDto>(Constant.UserEndpoint);

  return UserMapper.fromDto(response.data);
}
