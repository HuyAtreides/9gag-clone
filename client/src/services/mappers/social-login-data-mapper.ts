import SocialLoginData from '../../models/social-login-data';
import SocialLoginDataDto from '../dtos/social-login-data-dto';

export namespace SocialLoginDataMapper {
  export function toDto(data: SocialLoginData): SocialLoginDataDto {
    return data;
  }
}
