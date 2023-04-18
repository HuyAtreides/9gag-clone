import RegisterDataDto from './register-data-dto';

export default interface SocialLoginDataDto extends Omit<RegisterDataDto, 'password'> {
  readonly provider: string;
  readonly avatarUrl: string;
}
