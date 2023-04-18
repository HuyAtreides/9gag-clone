import { Country } from '../../models/enums/country';
import { SocialProvider } from '../../models/enums/social-provider';
import SocialLoginData from '../../models/social-login-data';
import { toEnum } from '../../utils/value-to-enum';
import GoogleUserProfile from '../dtos/google-user-profile';

export namespace GoogleUserProfileMapper {
  export function fromDto(profile: GoogleUserProfile): SocialLoginData {
    return {
      username: `${SocialProvider.GOOGLE}_${profile.metadata.sources[0].id}`,
      displayName: profile.names[0].displayName,
      avatarUrl: profile.photos[0].url,
      country: !profile.address
        ? undefined
        : toEnum(profile.address[0].countryCode, Country),
      provider: SocialProvider.GOOGLE,
    };
  }
}
