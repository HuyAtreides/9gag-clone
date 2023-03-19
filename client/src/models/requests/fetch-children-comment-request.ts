import { FetchCommentRequest } from './fetch-comment-request';

export interface FetchChildrenCommentRequest extends FetchCommentRequest {
  readonly parentId: number;
}
