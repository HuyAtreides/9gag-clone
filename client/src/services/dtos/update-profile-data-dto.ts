import RegisterDataDto from './register-data-dto';

export default interface UpdateProfileDataDto extends Omit<RegisterDataDto, 'password'> {
  readonly avatarUrl: string;

  readonly isPrivate: boolean;
}
