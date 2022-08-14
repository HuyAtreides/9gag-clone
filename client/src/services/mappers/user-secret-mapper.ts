import { UserSecret } from '../../models/user-secret';
import UserSecretDto from '../dtos/user-secret-dto';

export namespace UserSecretMapper {
  export function fromDto(data: UserSecretDto): UserSecret {
    return data;
  }
}
