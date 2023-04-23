import { UpdateProfileData } from '../../models/update-profile-data';
import UpdateProfileDataDto from '../dtos/update-profile-data-dto';

export namespace UpdateProfileDataMapper {
  export function toDto(data: UpdateProfileData): UpdateProfileDataDto {
    return data;
  }
}
