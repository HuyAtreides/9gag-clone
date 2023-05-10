import { UserStats } from '../../models/user-stats';
import { UserStatsDto } from '../dtos/user-stats-dto';

export namespace UserStatsMapper {
  export function fromDto(data: UserStatsDto): UserStats {
    return data;
  }
}
