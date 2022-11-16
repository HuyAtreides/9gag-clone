import { AxiosRequestConfig } from 'axios';
import { Constant } from '../models/enums/constant';
import NewPost from '../models/new-post';
import PageOptions from '../models/page-options';
import { createAxiosInstance } from '../utils/create-axios-instance';
import PostDto from './dtos/post-dto';
import SliceDto from './dtos/slice-dto';
import { NewPostMapper } from './mappers/new-post-mapper';
import { PageOptionsMapper } from './mappers/page-options-mapper';
import { PostMapper } from './mappers/post-mapper';
import { SliceMapper } from './mappers/slice-mapper';

const GET_POSTS_END_POINT = `${Constant.PostEndPoint}/tag`;
const UPVOTE_POST_END_POINT = `${Constant.PostEndPoint}/upvotes`;
const DOWNVOTE_POST_END_POINT = `${Constant.PostEndPoint}/downvotes`;
const UNUPVOTE_POST_END_POINT = `${Constant.PostEndPoint}/unupvotes`;
const UNDOWNVOTE_POST_END_POINT = `${Constant.PostEndPoint}/undownvotes`;

export async function getPostList(
  pageOptions: PageOptions,
  tag: string,
  section?: string,
) {
  const axios = createAxiosInstance();
  const pageOptionsDto = PageOptionsMapper.toDto(pageOptions);
  const axiosRequestConfig: AxiosRequestConfig = {
    params: pageOptionsDto,
  };

  const url = section
    ? `${GET_POSTS_END_POINT}/${tag}/${section}`
    : `${GET_POSTS_END_POINT}/${tag}`;

  const response = await axios.get<SliceDto<PostDto>>(url, axiosRequestConfig);

  return SliceMapper.fromDto(response.data, PostMapper.fromDto);
}

export async function upvote(id: number) {
  const axios = createAxiosInstance();
  const url = `${UPVOTE_POST_END_POINT}/${id}`;
  await axios.put<void>(url);
}

export async function unUpvote(id: number) {
  const axios = createAxiosInstance();
  const url = `${UNUPVOTE_POST_END_POINT}/${id}`;
  await axios.put<void>(url);
}
export async function downvote(id: number) {
  const axios = createAxiosInstance();
  const url = `${DOWNVOTE_POST_END_POINT}/${id}`;
  await axios.put<void>(url);
}

export async function unDownvote(id: number) {
  const axios = createAxiosInstance();
  const url = `${UNDOWNVOTE_POST_END_POINT}/${id}`;
  await axios.put<void>(url);
}

export async function addNewPost(newPost: NewPost) {
  const axios = createAxiosInstance();
  await axios.post<void>(Constant.PostEndPoint, NewPostMapper.toDto(newPost));
}
