import { SocialProvider } from './enums/social-provider';
import RegisterData from './register-data';

export default interface SocialLoginData extends Omit<RegisterData, 'password'> {
  readonly provider: SocialProvider;
  readonly avatarUrl: string;
  readonly socialId: string;
}
