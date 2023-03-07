import { PostsFetchingRequest } from './posts-fetching-request';

export interface UserSpecificPostFetchingRequest extends PostsFetchingRequest {
  readonly userId: number;
}
