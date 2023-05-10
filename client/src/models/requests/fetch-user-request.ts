import { PageFetchingRequest } from './page-fetching-request';

export interface FetchUserRequest extends PageFetchingRequest {
  readonly userId: number;
}
