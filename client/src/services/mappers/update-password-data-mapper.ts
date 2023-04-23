import UpdatePasswordData from '../../models/update-password-data';
import UpdatePasswordDataDto from '../dtos/update-password-data-dto';

export namespace UpdatePasswordDataMapper {
  export function toDto(data: UpdatePasswordData): UpdatePasswordDataDto {
    return data;
  }
}
