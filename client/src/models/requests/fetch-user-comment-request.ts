import { FetchCommentRequest } from './fetch-comment-request';

export interface FetchUserCommentRequest extends FetchCommentRequest {
  readonly userId: number;
}
