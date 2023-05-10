import { FollowRequestStatus } from '../../models/enums/follow-request-status';
import { UserDto } from './user-dto';

export default interface FollowRequestDto {
  readonly id: number;

  readonly sender: UserDto;

  readonly receiver: UserDto;

  readonly status: FollowRequestStatus;

  readonly created: string;
}
