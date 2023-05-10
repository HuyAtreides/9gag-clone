import { Country } from '../../models/enums/country';
import { User } from '../../models/user';
import { toEnum } from '../../utils/value-to-enum';
import { UserDto } from '../dtos/user-dto';

export namespace UserMapper {
  export function fromDto(user: UserDto): User {
    return new User({
      ...user,
      country: user.country ? toEnum(user.country, Country) : null,
      created: new Date(user.created),
      blockedTime: user.blockedTime ? new Date(user.blockedTime) : null,
    });
  }
}
