import RegisterDataDto from './register-data-dto';

export default interface UpdateProfileDataDto extends Omit<RegisterDataDto, 'password'> {
  readonly avatarUrl: string;

  readonly coverImgUrl: string;

  readonly isPrivate: boolean;

  readonly about: string;
}
