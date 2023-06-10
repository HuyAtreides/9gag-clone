import RegisterData from './register-data';

export interface UpdateProfileData extends Omit<RegisterData, 'password'> {
  readonly avatarUrl: string;

  readonly coverImgUrl: string;

  readonly isPrivate: boolean;
}
