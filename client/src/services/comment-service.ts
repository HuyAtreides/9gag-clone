import { AxiosRequestConfig } from 'axios';
import { Constant } from '../models/enums/constant';
import NewComment from '../models/new-comment';
import PageOptions from '../models/page-options';
import { createAxiosInstance } from '../utils/create-axios-instance';
import CommentDto from './dtos/comment-dto';
import PageDto from './dtos/page-dto';
import { CommentMapper } from './mappers/comment-mapper';
import { NewCommentMapper } from './mappers/new-comment-mapper';
import { PageMapper } from './mappers/page-mapper';
import { PageOptionsMapper } from './mappers/page-options-mapper';

export async function uploadNewPostComment(newComment: NewComment, postId: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.CommentEndPoint}/post/${postId}`;
  const response = await axios.post<number>(url, NewCommentMapper.toDto(newComment));

  return response.data;
}

export async function uploadReply(newComment: NewComment, replyToId: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.CommentEndPoint}/replyTo/${replyToId}`;
  const response = await axios.post<number>(url, NewCommentMapper.toDto(newComment));

  return response.data;
}

export async function updateComment(id: number, newComment: NewComment) {
  const axios = createAxiosInstance();
  const url = `${Constant.CommentEndPoint}/${id}`;
  await axios.put<void>(url, NewCommentMapper.toDto(newComment));
}

export async function getPostComments(postId: number, pageOptions: PageOptions) {
  const url = `${Constant.CommentEndPoint}/post/${postId}`;
  const pageOfComments = await getPageOfComments(url, pageOptions);

  return pageOfComments;
}

export async function deleteComment(id: number) {
  const url = `${Constant.CommentEndPoint}/${id}`;
  const axios = createAxiosInstance();
  await axios.delete<void>(url);
}

export async function getPostChildrenComments(
  parentId: number,
  pageOptions: PageOptions,
) {
  const url = `${Constant.CommentEndPoint}/${parentId}/children`;
  const pageOfComments = await getPageOfComments(url, pageOptions);

  return pageOfComments;
}

export async function getComment(id: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.CommentEndPoint}/${id}`;
  const response = await axios.get<CommentDto>(url);

  return CommentMapper.fromDto(response.data);
}

async function getPageOfComments(url: string, pageOptions: PageOptions) {
  const axios = createAxiosInstance();
  const pageOptionsDto = PageOptionsMapper.toDto(pageOptions);
  const axiosRequestConfig: AxiosRequestConfig = {
    params: pageOptionsDto,
  };
  const response = await axios.get<PageDto<CommentDto>>(url, axiosRequestConfig);

  return PageMapper.fromDto(response.data, CommentMapper.fromDto);
}

export async function upvote(id: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.CommentEndPoint}/upvotes/${id}`;
  await axios.put<void>(url);
}

export async function unUpvote(id: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.CommentEndPoint}/unupvotes/${id}`;
  await axios.put<void>(url);
}
export async function downvote(id: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.CommentEndPoint}/downvotes/${id}`;
  await axios.put<void>(url);
}

export async function unDownvote(id: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.CommentEndPoint}/undownvotes/${id}`;
  await axios.put<void>(url);
}
