import { Country } from '../../models/enums/country';
import { User } from '../../models/user';
import { toEnum } from '../../utils/value-to-enum';
import { UserDto } from '../dtos/user-dto';
import { SectionMapper } from './section-mapper';

export namespace UserMapper {
    export function fromDto(user: UserDto): User {
        return {
            ...user,
            country: user.country ? toEnum(user.country, Country) : null,
            favoriteSections: user.favoriteSections.map((favoriteSection) =>
                SectionMapper.toDto(favoriteSection),
            ),
            created: new Date(user.created),
        };
    }
}
