import { ResetPasswordData } from '../../models/reset-password-data';
import { ResetPasswordDataDto } from '../dtos/reset-password-data-dto';

export namespace ResetPasswordDataMapper {
  export function toDto(data: ResetPasswordData): ResetPasswordDataDto {
    return data;
  }
}
