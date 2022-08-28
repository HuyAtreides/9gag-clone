import LoginData from '../../models/login-data';
import LoginDataDto from '../dtos/login-data-dto';

export namespace LoginDataMapper {
  export function toDto(data: LoginData): LoginDataDto {
    return data;
  }
}