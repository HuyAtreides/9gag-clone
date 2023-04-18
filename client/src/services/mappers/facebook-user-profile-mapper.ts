import { SocialProvider } from '../../models/enums/social-provider';
import SocialLoginData from '../../models/social-login-data';
import FacebookUserProfile from '../dtos/facebook-user-profile';

export namespace FacebookUserProfileMapper {
  export function fromDto(data: FacebookUserProfile): SocialLoginData {
    return {
      displayName: data.name,
      username: `${SocialProvider.FACEBOOK}_${data.id}`,
      avatarUrl: data.picture.data.url,
      provider: SocialProvider.FACEBOOK,
    };
  }
}
