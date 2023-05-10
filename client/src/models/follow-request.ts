import { FollowRequestStatus } from './enums/follow-request-status';
import { User } from './user';

export default interface FollowRequest {
  readonly id: number;

  readonly sender: User;

  readonly receiver: User;

  readonly status: FollowRequestStatus;

  readonly created: Date;
}
