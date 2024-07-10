import AppComment from '../models/comment';

export function buildCommentURL(postId: number, comment: AppComment): string {
  let baseURL = `${process.env.REACT_APP_APP_URL}/post/${postId}?commentId=${comment.id}`;

  if (comment.parentId) {
    baseURL += `&parentId=${comment.parentId}`;
  }

  if (comment.replyToId) {
    baseURL += `&replyToId=${comment.replyToId}`;
  }

  return baseURL;
}
