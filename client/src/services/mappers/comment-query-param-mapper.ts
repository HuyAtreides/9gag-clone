import { URLSearchParams } from 'url';
import { CommentQueryParam } from '../../models/comment-query-param';

export namespace CommentQueryParamMapper {
  export function fromDto(data: URLSearchParams): CommentQueryParam {
    const commentId = Number(data.get('commentId'));
    const parentId = Number(data.get('parentId'));
    const replyToId = Number(data.get('replyToId'));

    return {
      commentId,
      parentId,
      replyToId,
    };
  }
}
