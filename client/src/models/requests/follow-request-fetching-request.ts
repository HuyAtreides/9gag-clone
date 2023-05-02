import { FollowRequestDirection } from '../enums/follow-request-direction';
import { FollowRequestStatus } from '../enums/follow-request-status';
import { PageFetchingRequest } from './page-fetching-request';

export interface FollowRequestFetchingRequest extends PageFetchingRequest {
  readonly status?: FollowRequestStatus;
  readonly direction: FollowRequestDirection;
  readonly priorityIds?: number[];
}
