import { Constant } from '../models/enums/constant';
import NewComment from '../models/new-comment';
import { createAxiosInstance } from '../utils/create-axios-instance';
import { NewCommentMapper } from './mappers/new-comment-mapper';

export async function addNewPost(newComment: NewComment, postId: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.CommentEndPoint}/post/${postId}`;
  await axios.post<void>(url, NewCommentMapper.toDto(newComment));
}
