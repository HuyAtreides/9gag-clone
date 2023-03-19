import { FetchCommentRequest } from './fetch-comment-request';

export interface FetchPostCommentRequest extends FetchCommentRequest {
  readonly postId: number;
}
