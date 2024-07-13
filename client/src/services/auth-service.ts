import { Constant } from '../models/enums/constant';
import RegisterData from '../models/register-data';
import LoginData from '../models/login-data';
import { User } from '../models/user';
import { UserSecret } from '../models/user-secret';
import { createAxiosInstance } from '../utils/create-axios-instance';
import { UserDto } from './dtos/user-dto';
import UserSecretDto from './dtos/user-secret-dto';
import { LocalStorage } from './local-storage';
import { RegisterDataMapper } from './mappers/register-data-mapper';
import { LoginDataMapper } from './mappers/login-data-mapper';
import { UserMapper } from './mappers/user-mapper';
import { UserSecretMapper } from './mappers/user-secret-mapper';
import SocialLoginData from '../models/social-login-data';
import { SocialLoginDataMapper } from './mappers/social-login-data-mapper';
import { ResetPasswordData } from '../models/reset-password-data';

const REGISTER_END_POINT = `${Constant.AuthEndpoint}/register`;
const LOGIN_END_POINT = `${Constant.AuthEndpoint}/login`;
const REFRESH_TOKEN_END_POINT = `${Constant.AuthEndpoint}/refresh-token`;

export async function registerUser(registerData: RegisterData): Promise<UserSecret> {
  const registerDataDto = RegisterDataMapper.toDto(registerData);
  const axios = createAxiosInstance();
  const response = await axios.post<UserSecretDto>(REGISTER_END_POINT, registerDataDto);
  return UserSecretMapper.fromDto(response.data);
}

export async function loginUser(loginData: LoginData): Promise<UserSecret> {
  const loginDataDto = LoginDataMapper.toDto(loginData);
  const axios = createAxiosInstance();
  const response = await axios.post<UserSecretDto>(LOGIN_END_POINT, loginDataDto);
  return UserSecretMapper.fromDto(response.data);
}

export async function loginUserWithSocialSignIn(socialLoginData: SocialLoginData) {
  const loginDataDto = SocialLoginDataMapper.toDto(socialLoginData);
  const axios = createAxiosInstance();
  const response = await axios.post<UserSecretDto>(
    `${Constant.AuthEndpoint}/social-login`,
    loginDataDto,
  );
  return UserSecretMapper.fromDto(response.data);
}

export async function getUserInfo(): Promise<User> {
  const axios = createAxiosInstance();
  const response = await axios.get<UserDto>(Constant.UserEndpoint);

  return UserMapper.fromDto(response.data);
}

/**  Refresh invalid token. */
export async function refreshToken(): Promise<void> {
  const axios = createAxiosInstance();
  const token = LocalStorage.get(Constant.TokenKey);

  if (token === null) {
    throw new Error('Cannot refresh token because token is missing');
  }
  const userSecretDto = UserSecretMapper.toDto({ token: token as string });
  const response = await axios.post<UserSecretDto>(
    REFRESH_TOKEN_END_POINT,
    userSecretDto,
  );

  const newUserSecret = UserSecretMapper.fromDto(response.data);
  LocalStorage.save(Constant.TokenKey, newUserSecret.token);
}

export async function sendResetPasswordRequest(resetPasswordData: ResetPasswordData) {
  const axios = createAxiosInstance();

  await axios.post(`${Constant.AuthEndpoint}/reset-password`, resetPasswordData);
}

export async function generateCode(email: string) {
  const axios = createAxiosInstance();

  await axios.post(`${Constant.AuthEndpoint}/reset-password-code/${email}`);
}
